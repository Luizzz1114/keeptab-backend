import { CreateAbonoDTO } from '../schemas/Abonos.dto';
import VentasRepository from '../repositories/Ventas.repository';
import AbonosRepository from '../repositories/Abonos.repository';
import { AppDataSource } from '../config/database';

class AbonosService {

  private ventasRepository: VentasRepository;
  private abonosRepository: AbonosRepository;

  constructor() {
    this.ventasRepository = new VentasRepository();
    this.abonosRepository = new AbonosRepository();
  }

  async create(data: CreateAbonoDTO) {

    const venta = await this.ventasRepository.getById(data.venta_id);
    if(!venta) {
      return { success: false, type: 'NOT_FOUND', message: `Venta con ID ${data.venta_id} no encontrada` };
    };
  
    let estatus_venta: string = 'FIADA'
    if (data.monto >= venta.total) estatus_venta = 'PAGADA';
    
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
    return await this.abonosRepository.getAll();
  }

  async getById(id: number) {
    return await this.abonosRepository.getById(id);
  }

  async delete(id: number) {
    const abono = await this.abonosRepository.getById(id);
    if (!abono) {
      return { success: false, type: 'NOT_FOUND', message: `Abono con ID ${id} no encontrado` };
    }
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.ventasRepository.updateStatus(abono.venta.id, 'FIADA', queryRunner.manager);
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