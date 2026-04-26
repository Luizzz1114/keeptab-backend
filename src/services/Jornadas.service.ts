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
      return { success: false, type: 'CONFLICT', message: 'Ya existe una jornada abierta.' };
    }
    try {
      const jornada = await this.jornadasRepository.create(data);
      return { success: true, data: jornada };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async getAll() {
    const jornadas = await this.jornadasRepository.getAll();
    return { success: true, data: jornadas };
  }

  async getById(id: number) {
    const jornada = await this.jornadasRepository.getById(id);
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'Jornada no encontrada' };
    return { success: true, data: jornada };
  }

  async getEstadoActual() {
    const jornada = await this.jornadasRepository.getJornadaAbierta();
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'No hay ninguna jornada abierta actualmente' };
    
    const ahora = new Date();
    const ventasHoy = await this.ventasRepository.getSumVentasPagadas(jornada.apertura, ahora);
    
    return {
      success: true,
      data: {
        id: jornada.id,
        fondo_inicial: Number(jornada.fondo_inicial),
        ventas_efectivo: ventasHoy,
        total_esperado: Number(jornada.fondo_inicial) + ventasHoy,
        abierta_desde: jornada.apertura,
        ventas: jornada.ventas
      }
    };
  }

  async cerrar(id: number, data: CerrarJornadaDTO) {
    const jornada = await this.jornadasRepository.getById(id);
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'Jornada no encontrada' };
    if (jornada.estatus === 'CERRADA') return { success: false, type: 'CONFLICT', message: 'Esta jornada ya se encuentra cerrada' };

    try {
      const ahora = new Date();
      const ingresosVentas = await this.ventasRepository.getSumVentasPagadas(jornada.apertura, ahora);
      const esperado = Number(jornada.fondo_inicial) + ingresosVentas;

      jornada.estatus = 'CERRADA';
      jornada.cierre = ahora;
      jornada.total_fisico = data.total_fisico;
      jornada.total_ventas = ingresosVentas; 
      jornada.diferencia = data.total_fisico - esperado;

      const jornadaCerrada = await this.jornadasRepository.update(jornada);
      return { success: true, data: jornadaCerrada };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async delete(id: number) {
    const jornada = await this.jornadasRepository.getById(id);
    if (!jornada) return { success: false, type: 'NOT_FOUND', message: 'Jornada no encontrada' };
    
    if (jornada.estatus === 'CERRADA') {
      return { success: false, type: 'CONFLICT', message: 'No se puede eliminar una jornada cerrada (Integridad contable)' };
    }

    try {
      await this.jornadasRepository.delete(jornada);
      return { success: true };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }
}

export default JornadasService;