import bcrypt from 'bcrypt';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from '../schemas/Usuarios.dto';
import UsuariosRepository from '../repositories/Usuarios.repository';

class UsuariosService {

  private repository: UsuariosRepository;

  constructor() {
    this.repository = new UsuariosRepository();
  }

  async create(data: CreateUsuarioDTO) {
    const existe = await this.repository.getByUsername(data.username);
    if (existe) return { success: false, type: 'CONFLICT', message: `El nombre de usuario '${data.username}' ya está en uso` };
    
    try {
      const { password, ...usuarioData } = data;
      const passwordHash = await bcrypt.hash(password, 10);
      const nuevoUsuario = {
        ...usuarioData,
        passwordHash
      };

      const usuarioCreado = await this.repository.create(nuevoUsuario);
      const { passwordHash: _, refreshToken, ...usuarioSeguro } = usuarioCreado;
      return { success: true, data: usuarioSeguro };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async getAll(query: { username?: string }) {
    if (query.username) {
      const usuario = await this.repository.getByUsername(query.username);
      return { success: true, data: usuario ? [usuario] : [] };
    }
    const usuarios = await this.repository.getAll();
    return { success: true, data: usuarios };
  }

  async getById(id: number) {
    const usuario = await this.repository.getById(id);
    if (!usuario) return { success: false, type: 'NOT_FOUND', message: 'Usuario no encontrado' };
    return { success: true, data: usuario };
  }

  async update(id: number, data: UpdateUsuarioDTO) {
    const usuario = await this.repository.getById(id);
    if (!usuario) return { success: false, type: 'NOT_FOUND', message: 'Usuario no encontrado' };
    
    if (data.username && data.username !== usuario.username) {
      const existe = await this.repository.getByUsername(data.username);
      if (existe) return { success: false, type: 'CONFLICT', message: `El nombre de usuario '${data.username}' ya está en uso` };
    }

    try {
      const dataActualizar: any = { ...data };
      if (data.password) {
        dataActualizar.passwordHash = await bcrypt.hash(data.password, 10);
        delete dataActualizar.password;
      }
      Object.assign(usuario, dataActualizar);
      const usuarioActualizado = await this.repository.update(usuario);
      return { success: true, data: usuarioActualizado };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async delete(id: number) {
    const usuario = await this.repository.getById(id);
    if (!usuario) return { success: false, type: 'NOT_FOUND', message: 'Usuario no encontrado' };
    try {
      await this.repository.delete(usuario);
      return { success: true };
    } catch (error) {
      return { success: false, type: 'CONFLICT', message: 'No se puede eliminar el usuario debido a restricciones de la base de datos' };
    }
  }
  
}

export default UsuariosService;