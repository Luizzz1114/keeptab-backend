import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { CreateProductoDTO } from '../schemas/Productos.dto';
import Productos from '../models/Productos.model';

class ProductosRepository {

  private repository: Repository<Productos>

  constructor() {
    this.repository = AppDataSource.getRepository(Productos);
  }

  async create(data: CreateProductoDTO) {
    const producto = this.repository.create(data);
    return await this.repository.save(producto);
  }

  async getAll() {
    return await this.repository.find();
  }

  async getById(id: Productos['id']) {
    return await this.repository.findOneBy({ id });
  }

  async update(producto: Productos, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Productos) : this.repository;
    return await repo.save(producto);
  }

  async delete(producto: Productos) {
    return await this.repository.softDelete(producto);
  }
  
}

export default ProductosRepository;