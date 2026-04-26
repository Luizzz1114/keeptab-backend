import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { AbrirJornadaDTO } from '../schemas/Jornadas.dto';
import Jornadas from '../models/Jornadas.model';

class JornadasRepository {

  private repository: Repository<Jornadas>;

  constructor() {
    this.repository = AppDataSource.getRepository(Jornadas);
  }

  async getJornadaAbierta() {
    return await this.repository.findOne({ 
      where: { 
        estatus: 'ABIERTA' 
      }, 
      relations: ['ventas'] 
    });
  }

  async create(data: AbrirJornadaDTO) {
    const jornada = this.repository.create(data);
    return await this.repository.save(jornada);
  }

  async getAll() {
    return await this.repository.find({ order: { created_at: 'DESC' } });
  }

  async getById(id: Jornadas['id']) {
    return await this.repository.findOne({ 
      where: { 
        id: id 
      },
      relations: {
        ventas: {
          detalles: {
            producto: true
          }
        }
      } 
    });
  }

  async update(jornada: Jornadas) {
    return await this.repository.save(jornada);
  }

  async delete(jornada: Jornadas) {
    return await this.repository.remove(jornada);
  }
}

export default JornadasRepository;