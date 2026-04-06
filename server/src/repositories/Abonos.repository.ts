import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { CreateAbonoDTO } from '../schemas/Abonos.dto';
import Abonos from '../models/Abonos.model';

class AbonosRepository {

  private repository: Repository<Abonos>;

  constructor() {
    this.repository = AppDataSource.getRepository(Abonos);
  }

  async create(data: CreateAbonoDTO, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Abonos) : this.repository;
    const abono = repo.create({
      monto: data.monto,
      venta: { id: data.venta_id }
    });
    return await repo.save(abono);
  }

  async getAll() {
    return await this.repository.find();
  }

  async getById(id: Abonos['id']) {
    return await this.repository.findOne({
      where: { id: id },
      relations: ['venta', 'venta.abonos']
    });
  }

  async delete(abono: Abonos, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Abonos) : this.repository;
    return await repo.remove(abono);
  }
  
}

export default AbonosRepository;