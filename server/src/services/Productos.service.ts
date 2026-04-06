import { CreateProductoDTO, UpdateProductoDTO } from '../schemas/Productos.dto';
import ProductosRepository from '../repositories/Productos.repository';

class ProductosService {

  private repository: ProductosRepository;

  constructor() {
    this.repository = new ProductosRepository();
  }

  async create(data: CreateProductoDTO) {
    const existe = await this.repository.getByNombre(data.nombre);
    if (existe) return { success: false, type: 'CONFLICT', message: `El producto '${data.nombre}' ya está registrado` };

    try {
      const producto = await this.repository.create(data);
      return { success: true, data: producto };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async getAll(query: { nombre?: string; }) {
    if (query.nombre) {
      const producto = await this.repository.getByNombre(query.nombre);
      return { success: true, data: producto ? [producto] : [] };
    }
    const productos = await this.repository.getAll();
    return { success: true, data: productos };
  }

  async getById(id: number) {
    const producto = await this.repository.getById(id);
    if (!producto) return { success: false, type: 'NOT_FOUND', message: `Producto no encontrado` };
    return { success: true, data: producto };
  }

  async update(id: number, data: UpdateProductoDTO) {
    const producto = await this.repository.getById(id);
    if (!producto) return { success: false, type: 'NOT_FOUND', message: `Producto no encontrado` };
    
    if (data.nombre && data.nombre !== producto.nombre) {
      const existe = await this.repository.getByNombre(data.nombre);
      if (existe) return { success: false, type: 'CONFLICT', message: `El producto '${data.nombre}' ya existe` };
    }

    try {
      Object.assign(producto, data);
      await this.repository.update(producto);
      return { success: true, data: producto };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async delete(id: number) {
    const producto = await this.repository.getById(id);
    if (!producto) return { success: false, type: 'NOT_FOUND', message: `Producto no encontrado` };
    
    try {
      await this.repository.delete(producto);
      return { success: true };
    } catch (error) {
      return { success: false, type: 'DB_ERROR', message: 'Error al eliminar el producto' };
    }
  }

}

export default ProductosService;