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
    if (!cliente) return null;
    return await this.ventasRepository.getDeudasByCliente(id);
  }

  async update(id: number, data: UpdateClienteDTO) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return null;
    Object.assign(cliente, data);
    return await this.clientesRepository.update(cliente);
  }

  async delete(id: number) {
    const cliente = await this.clientesRepository.getById(id);
    if (!cliente) return null;
    return await this.clientesRepository.delete(cliente);
  }

}

export default ClientesService;