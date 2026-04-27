import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { CreateClienteDTO } from '../schemas/Clientes.dto';
import Clientes from '../models/Clientes.model';

class ClientesRepository {

  private repository: Repository<Clientes>;

  constructor() {
    this.repository = AppDataSource.getRepository(Clientes);
  }

  async create(data: CreateClienteDTO) {
    const cliente = this.repository.create(data);
    return await this.repository.save(cliente);
  }

  async getAll() {
    return await this.repository.createQueryBuilder('clientes')
      .leftJoin('clientes.ventas', 'venta', 'venta.estatus = :estatus', { estatus: 'CREDITO' })
      .leftJoin('venta.abonos', 'abono')
      .select('clientes.id', 'id')
      .addSelect('clientes.nombre', 'nombre')
      .addSelect('clientes.cedula', 'cedula')
      .addSelect('clientes.contacto', 'contacto')
      .addSelect(`COALESCE(SUM(DISTINCT venta.total), 0) - COALESCE(SUM(abono.monto), 0)`, 'deuda')
      .groupBy('clientes.id')
      .addGroupBy('clientes.nombre')
      .addGroupBy('clientes.cedula')
      .addGroupBy('clientes.contacto')
      .getRawMany();
  }

  async getById(id: Clientes['id']) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        ventas: {
          detalles: {
            producto: true,
          },
          abonos: true,
        }
      }, 
      order: {
        ventas: {
          created_at: 'ASC'
        },
      }
    });
  }

  async getByCedula(cedula: string) {
    return await this.repository.findOne({
      where: { cedula: cedula },
      withDeleted: true
    });
  }

  async update(cliente: Clientes) {
    return await this.repository.save(cliente);
  }

  async delete(cliente: Clientes) {
    return await this.repository.softRemove(cliente);
  }
  
}

export default ClientesRepository;