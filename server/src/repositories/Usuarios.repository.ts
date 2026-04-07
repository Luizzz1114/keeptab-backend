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
      select: ['id', 'username', 'rol', 'created_at', 'updated_at']
    });
  }

  async getById(id: Usuarios['id']) {
    return await this.repository.findOneBy({ id });
  }

  async getByUsername(username: string) {
    return await this.repository.findOneBy({ username });
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