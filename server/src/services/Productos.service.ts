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
    if (!producto) return { success: false, type: 'NOT_FOUND', message: `Producto no encontrado` };
    Object.assign(producto, data);
    await this.repository.update(producto);
    return { success: true, data: producto };
  }

  async delete(id: number) {
    const producto = await this.getById(id);
    if (!producto) return { success: false, type: 'NOT_FOUND', message: `Producto no encontrado` };
    await this.repository.delete(producto);
    return { success: true };
  }

}

export default ProductosService;