import { AbrirJornadaDTO, CerrarJornadaDTO } from '../schemas/Jornadas.dto';
import JornadasRepository from '../repositories/Jornadas.repository';
import VentasRepository from '../repositories/Ventas.repository';

class JornadasService {

  private ventasRepository: VentasRepository;
  private jornadasRepository: JornadasRepository;

  constructor() {
    this.ventasRepository = new VentasRepository();
    this.jornadasRepository = new JornadasRepository();
  }

  async abrir(data: AbrirJornadaDTO) {
    const jornadaAbierta = await this.jornadasRepository.getJornadaAbierta();
    if (jornadaAbierta) {
      return { success: false, type: 'CONFLICT', message: 'Ya existe una jornada abierta. Ciérrala antes de abrir otra.' };
    }
    const jornada = await this.jornadasRepository.create(data);
    return { success: true, data: jornada };
  }

  async getAll() {
    return await this.jornadasRepository.getAll();
  }

  async getById(id: number) {
    return await this.jornadasRepository.getById(id);
  }

  async getEstadoActual() {
    const jornada = await this.jornadasRepository.getJornadaAbierta();
    if (!jornada) return { success: false, message: 'No hay ninguna jornada abierta' };
    const ahora = new Date();
    const ventasHoy = await this.ventasRepository.getSumVentasPagadas(jornada.apertura, ahora);
    return {
      success: true,
      data: {
        id: jornada.id,
        fondo_inicial: Number(jornada.fondo_inicial),
        ventas_efectivo: ventasHoy,
        total_esperado: Number(jornada.fondo_inicial) + ventasHoy,
        abierta_desde: jornada.apertura
      }
    };
  }

  async cerrar(id: number, data: CerrarJornadaDTO) {
    const jornada = await this.jornadasRepository.getById(id);
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'Jornada no encontrada' };
    
    const ahora = new Date();
    const ingresosVentas = await this.ventasRepository.getSumVentasPagadas(jornada.apertura, ahora);
    const fondo = Number(jornada.fondo_inicial);
    const fisico = data.total_fisico;
    const esperado = fondo + ingresosVentas;

    jornada.estatus = 'CERRADA';
    jornada.cierre = ahora;
    jornada.total_fisico = fisico;
    jornada.total_ventas = ingresosVentas; 
    jornada.diferencia = fisico - esperado;

    const jornadaCerrada = await this.jornadasRepository.update(jornada);
    return { success: true, data: jornadaCerrada };
  }

  async delete(id: number) {
    const jornada = await this.jornadasRepository.getById(id);
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'Jornada no encontrada' };
    if (jornada.estatus === 'CERRADA') return { success: false, type: 'BAD_REQUEST', message: 'No se puede eliminar una jornada ya cerrada' };
    await this.jornadasRepository.delete(jornada);
    return { success: true };
  }
}

export default JornadasService;