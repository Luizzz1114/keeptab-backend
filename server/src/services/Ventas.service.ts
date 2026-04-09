import { AppDataSource } from '../config/database';
import JornadasRepository from '../repositories/Jornadas.repository';
import ClientesRepository from '../repositories/Clientes.repository';
import ProductosRepository from '../repositories/Productos.repository';
import VentasRepository, { DetalleVentaInput } from '../repositories/Ventas.repository';
import { CreateVentaDTO } from '../schemas/Ventas.dto';

class VentasService {

  private jornadasRepository: JornadasRepository;
  private clientesRepository: ClientesRepository;
  private productosRepository: ProductosRepository;
  private ventasRepository: VentasRepository;

  constructor() {
    this.jornadasRepository = new JornadasRepository();
    this.clientesRepository = new ClientesRepository();
    this.productosRepository = new ProductosRepository();
    this.ventasRepository = new VentasRepository();
  }

  async create(data: CreateVentaDTO) {

    if (data.cliente_id !== undefined && data.cliente_id !== null) {
      const cliente = await this.clientesRepository.getById(data.cliente_id);
      if (!cliente) {
        return { success: false, type: 'NOT_FOUND', message: `Cliente con ID ${data.cliente_id} no encontrado` };
      }
    }

    const jornadaAbierta = await this.jornadasRepository.getJornadaAbierta();
    let jornadaId = null;
    if (jornadaAbierta) {
      jornadaId = jornadaAbierta.id;
    }

    let total = 0;
    const detalles: DetalleVentaInput[] = [];
    const productosUpdate = [];

    for (const item of data.detalles) {
      const producto = await this.productosRepository.getById(item.producto_id);
      if (!producto) {
        return { success: false, type: 'NOT_FOUND', message: `Producto con ID ${item.producto_id} no encontrado` };
      }
      if (producto.conteo) {
        if (producto.stock < item.cantidad) {
          return { success: false, type: 'INSUFFICIENT_STOCK', message: `Stock insuficiente para: ${producto.nombre}` };
        }
        producto.stock -= item.cantidad;
        productosUpdate.push(producto);
      }
      const subtotal = Number(producto.precio) * item.cantidad;
      total += subtotal;
      detalles.push({
        cantidad: item.cantidad,
        precio_unitario: Number(producto.precio),
        subtotal,
        producto: { id: producto.id },
      });
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      for (const p of productosUpdate) {
        await this.productosRepository.update(p, queryRunner.manager);
      }

      const venta = await this.ventasRepository.create({
        total,
        estatus: data.estatus,
        cliente: data.cliente_id ? { id: data.cliente_id } as any : undefined,
        jornada: jornadaId ? { id: jornadaId } as any : undefined,
        detalles
      }, queryRunner.manager);

      await queryRunner.commitTransaction();
      return { success: true, data: venta };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, type: 'DB_ERROR' };
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(query: { estatus?: string; fecha?: string }) {
    const filtros: any = {};

    if (query.estatus) {
      filtros.estatus = query.estatus.toUpperCase();
    }

    if (query.fecha === 'hoy') {
      const inicio = new Date();
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date();
      fin.setHours(23, 59, 59, 999);
      filtros.fechaInicio = inicio;
      filtros.fechaFin = fin;
    }

    const ventas = await this.ventasRepository.getAll(filtros);
    return { success: true, data: ventas };
  }

  async getById(id: number) {
    const venta = await this.ventasRepository.getById(id);
    if (!venta) return { success: false, type: 'NOT_FOUND', message: 'Venta no encontrada' };
    return { success: true, data: venta };
  }

  async delete(id: number) {

    const venta = await this.ventasRepository.getById(id);
    if (!venta) {
      return { success: false, type: 'NOT_FOUND', message: `Venta con ID ${id} no encontrada` };
    }

    const productosUpdate = [];
    for (const detalle of venta.detalles_venta) {
      if (detalle.producto && detalle.producto.conteo) {
        detalle.producto.stock += detalle.cantidad;
        productosUpdate.push(detalle.producto);
      }
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const p of productosUpdate) {
        await this.productosRepository.update(p, queryRunner.manager);
      }

      await this.ventasRepository.delete(venta, queryRunner.manager);

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

export default VentasService;