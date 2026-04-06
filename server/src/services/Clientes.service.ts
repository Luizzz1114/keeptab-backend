import { CreateClienteDTO, UpdateClienteDTO } from '../schemas/Clientes.dto';
import VentasRepository from '../repositories/Ventas.repository';
import ClientesRepository from '../repositories/Clientes.repository';

class ClientesService {

  private ventasRepository: VentasRepository;
  private clientesRepository: ClientesRepository;

  constructor() {
    this.ventasRepository = new VentasRepository();
    this.clientesRepository = new ClientesRepository();
  }

  async create(data: CreateClienteDTO) {
    const existe = await this.clientesRepository.getByCedula(data.cedula);
    if (existe) return { success: false, type: 'CONFLICT', message: `La cédula ${data.cedula} ya está registrada` };
    
    try {
      const cliente = await this.clientesRepository.create(data);
      return { success: true, data: cliente };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async getAll(query: { cedula?: string; }) {
    if (query.cedula) {
      const cliente = await this.clientesRepository.getByCedula(query.cedula);
      return { success: true, data: cliente ? [cliente] : [] };
    }
    const clientes = await this.clientesRepository.getAll();
    return { success: true, data: clientes };
  }

  async getById(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: 'Cliente no encontrado' };
    return { success: true, data: cliente };
  }

  async getDeudas(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: 'Cliente no encontrado' };
    const deudas = await this.ventasRepository.getDeudasByCliente(id);
    return { success: true, data: deudas };
  }

  async update(id: number, data: UpdateClienteDTO) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: 'Cliente no encontrado' };
    
    if (data.cedula && data.cedula !== cliente.cedula) {
      const existe = await this.clientesRepository.getByCedula(data.cedula);
      if (existe) return { success: false, type: 'CONFLICT', message: `La cédula ${data.cedula} ya está en uso` };
    }

    try {
      Object.assign(cliente, data);
      await this.clientesRepository.update(cliente);
      return { success: true, data: cliente };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async delete(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: 'Cliente no encontrado' };
    
    try {
      await this.clientesRepository.delete(cliente);
      return { success: true };
    } catch (error) {
      return { success: false, type: 'CONFLICT', message: 'No se puede eliminar un cliente con ventas asociadas' };
    }
  }

}

export default ClientesService;