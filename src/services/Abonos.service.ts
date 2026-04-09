import { AppDataSource } from '../config/database';
import { CreateAbonoDTO } from '../schemas/Abonos.dto';
import VentasRepository from '../repositories/Ventas.repository';
import AbonosRepository from '../repositories/Abonos.repository';

class AbonosService {

  private ventasRepository: VentasRepository;
  private abonosRepository: AbonosRepository;

  constructor() {
    this.ventasRepository = new VentasRepository();
    this.abonosRepository = new AbonosRepository();
  }

  async create(data: CreateAbonoDTO) {

    const venta = await this.ventasRepository.getById(data.venta_id);
    if (!venta) return { success: false, type: 'NOT_FOUND', message: `Venta con ID ${data.venta_id} no encontrada` };
    if (venta.estatus === 'PAGADA') return { success: false, type: 'CONFLICT', message: `Venta con ID ${data.venta_id} se encuentra totalmente pagada` };
    
    const abonosAnteriores = venta.abonos || [];
    const sumaAnteriores = abonosAnteriores.reduce((acumulado, abono) => acumulado + Number(abono.monto), 0);
    const totalPagado = sumaAnteriores + Number(data.monto);

    const totalVenta = Number(venta.total);
    let estatus_venta: string = 'FIADA';
    
    if (totalVenta > 0 && totalPagado >= totalVenta) {
      estatus_venta = 'PAGADA';
    }
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.ventasRepository.updateStatus(data.venta_id, estatus_venta, queryRunner.manager);
      const abono = await this.abonosRepository.create(data, queryRunner.manager);
      await queryRunner.commitTransaction();
      return { success: true, data: abono };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, type: 'DB_ERROR' };
    } finally {
      await queryRunner.release();
    }
  }

  async getAll() {
    const abonos = await this.abonosRepository.getAll();
    return { success: true, data: abonos };
  }

  async getById(id: number) {
    const abono = await this.abonosRepository.getById(id);
    if (!abono) return { success: false, type: 'NOT_FOUND', message: 'Abono no encontrado' }; 
    return { success: true, data: abono };
  }

  async delete(id: number) {
    const abono = await this.abonosRepository.getById(id);
    if (!abono) return { success: false, type: 'NOT_FOUND', message: 'Abono no encontrado' };

    const abonosActuales = abono.venta.abonos || [];
    const abonosRestantes = abonosActuales.filter(a => a.id !== abono.id);
    const sumaRestante = abonosRestantes.reduce((acumulado, a) => acumulado + Number(a.monto), 0);

    let estatus_venta: string = 'FIADA';
    if (sumaRestante >= Number(abono.venta.total)) {
      estatus_venta = 'PAGADA';
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await this.ventasRepository.updateStatus(abono.venta.id, estatus_venta, queryRunner.manager);
      await this.abonosRepository.delete(abono, queryRunner.manager);
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, type: 'DB_ERROR' };
    } finally {
      await queryRunner.release();
    }
  }

}

export default AbonosService;