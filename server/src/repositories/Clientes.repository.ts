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
    return await this.repository.find();
  }

  async getById(id: Clientes['id']) {
    return await this.repository.findOneBy({ id });
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