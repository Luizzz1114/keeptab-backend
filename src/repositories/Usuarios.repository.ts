import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import Usuarios from '../models/Usuarios.model';

class UsuariosRepository {

  private repository: Repository<Usuarios>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuarios);
  }

  async create(data: Partial<Usuarios>) {
    const usuario = this.repository.create(data);
    return await this.repository.save(usuario);
  }

  async getAll() {
    return await this.repository.find({
      select: {
        id: true,
        username: true,
        rol: true
      }
    });
  }

  async getById(id: Usuarios['id']) {
    return await this.repository.findOneBy({ id });
  }

  async getByUsername(username: string) {
    return await this.repository.findOne({
      where: { username: username },
      withDeleted: true,
      select: {
        id: true,
        username: true,
        rol: true
      }
    });
  }

  async countAdmin() {
    return await this.repository.countBy({ rol: 'ADMIN' });
  }

  async getByUsernameWithPassword(username: string) {
    return await this.repository.findOne({
      where: { username },
      select: ['id', 'username', 'rol', 'passwordHash', 'refreshToken']
    });
  }

  async update(usuario: Usuarios) {
    return await this.repository.save(usuario);
  }

  async delete(usuario: Usuarios) {
    return await this.repository.remove(usuario);
  }
  
}

export default UsuariosRepository;