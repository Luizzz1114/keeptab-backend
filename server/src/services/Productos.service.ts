import { CreateProductoDTO, UpdateProductoDTO } from '../schemas/Productos.dto';
import ProductosRepository from '../repositories/Productos.repository';

class ProductosService {

  private repository: ProductosRepository;

  constructor() {
    this.repository = new ProductosRepository();
  }

  async create(data: CreateProductoDTO) {
    return await this.repository.create(data);
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async getById(id: number) {
    return await this.repository.getById(id);
  }

  async update(id: number, data: UpdateProductoDTO) {
    const producto = await this.getById(id);
    if (!producto) return null;
    Object.assign(producto, data);
    return await this.repository.update(producto);
  }

  async delete(id: number) {
    const producto = await this.getById(id);
    if (!producto) return null;
    return await this.repository.delete(producto);
  }

}

export default ProductosService;
