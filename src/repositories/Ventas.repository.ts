import { EntityManager, Repository, Between, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../config/database';
import Ventas from '../models/Ventas.model';
import DetallesVenta from '../models/Detalles_venta.model';

export interface DetalleVentaInput {
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto: { id: number };
}

export interface CreateVentaInput {
  total: number;
  estatus: string;
  cliente: { id: number } | null;
  jornada: { id: number } | null;
  detalles: DetalleVentaInput[];
}

class VentasRepository {
  
  private repository: Repository<Ventas>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ventas);
  }

  async create(data: CreateVentaInput, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Ventas) : this.repository;
    const venta = repo.create({
      total: data.total,
      estatus: data.estatus,
      jornada: data.jornada ?? undefined,
      cliente: data.cliente ?? undefined,
      detalles_venta: data.detalles as DetallesVenta[],
    });
    return await repo.save(venta);
  }

  async getAll(filtros?: { estatus?: string; fechaInicio?: Date; fechaFin?: Date }) {
    const where: FindOptionsWhere<Ventas> = {};
    if (filtros?.estatus) {
      where.estatus = filtros.estatus;
    }
    if (filtros?.fechaInicio && filtros?.fechaFin) {
      where.fecha = Between(filtros.fechaInicio, filtros.fechaFin);
    }
    return await this.repository.find({
      where,
      relations: ['cliente', 'detalles_venta'],
      order: {
        created_at: 'DESC'
      },
      withDeleted: true
    });
  }

  async getById(id: Ventas['id']) {
    return await this.repository.findOne({
      where: { id: id },
      relations: [
        'cliente',
        'jornada',
        'detalles_venta',
        'detalles_venta.producto',
        'abonos'
      ],
      withDeleted: true
    });
  }

  async getSumVentasPagadas(desde: Date, hasta: Date) {
    const resultado = await this.repository
      .createQueryBuilder("venta")
      .select("SUM(venta.total)", "sum")
      .where("venta.estatus = :estatus", { estatus: 'PAGADA' })
      .andWhere("venta.created_at BETWEEN :desde AND :hasta", { desde, hasta })
      .getRawOne();
    return Number(resultado.sum || 0);
  }

  async getDeudasByCliente(cliente_id: number) {
    return await this.repository.find({
      where: {
        cliente: { id: cliente_id },
        estatus: 'FIADA'
      },
      relations: ['detalles_venta', 'abonos'], 
      order: {
        created_at: 'ASC'
      }
    });
  }

  async updateStatus(id: Ventas['id'], estatus: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Ventas) : this.repository;
    await repo.update(id, { estatus });
  }

  async delete(venta: Ventas, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Ventas) : this.repository;
    return await repo.remove(venta); 
  }

}

export default VentasRepository;