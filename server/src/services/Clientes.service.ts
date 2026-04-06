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
    return await this.clientesRepository.create(data);
  }

  async getAll() {
    return await this.clientesRepository.getAll();
  }

  async getById(id: number) {
    return await this.clientesRepository.getById(id);
  }

  async getDeudas(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: `Cliente no encontrado` };
    const deudas = await this.ventasRepository.getDeudasByCliente(id);
    return { success: true, data: deudas };
  }

  async update(id: number, data: UpdateClienteDTO) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: `Cliente no encontrado` };
    Object.assign(cliente, data);
    await this.clientesRepository.update(cliente);
    return { success: true, data: cliente };
  }

  async delete(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return { success: false, type: 'NOT_FOUND', message: `Cliente no encontrado` };
    await this.clientesRepository.delete(cliente);
    return { success: true };
  }

}

export default ClientesService;