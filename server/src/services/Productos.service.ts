import { CreateProductoDTO, UpdateProductoDTO } from '../schemas/Productos.dto';
import ProductosRepository from '../repositories/Productos.repository';

class ProductosService {

  private reposity: ProductosRepository;

  constructor() {
    this.reposity = new ProductosRepository();
  }

  async create(data: CreateProductoDTO) {
    return await this.reposity.create(data);
  }

  async getAll() {
    return await this.reposity.getAll();
  }

  async getById(id: number) {
    return await this.reposity.getById(id);
  }

  async update(id: number, data: UpdateProductoDTO) {
    const producto = await this.getById(id);
    if (!producto) return null;
    Object.assign(producto, data);
    return await this.reposity.update(producto);
  }

  async delete(id: number) {
    const producto = await this.getById(id);
    if (!producto) return null;
    return await this.reposity.delete(producto);
  }

}

export default ProductosService;