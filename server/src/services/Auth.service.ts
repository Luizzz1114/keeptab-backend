import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UsuariosRepository from '../repositories/Usuarios.repository';
import { LoginDTO } from '../schemas/Auth.dto';

class AuthService {

  private usuariosRepository: UsuariosRepository;

  constructor() {
    this.usuariosRepository = new UsuariosRepository();
  }

  async login(data: LoginDTO) {
    const usuario = await this.usuariosRepository.getByUsernameWithPassword(data.username);
    if (!usuario) return { success: false, type: 'UNAUTHORIZED', message: 'Credenciales inválidas' };
    
    const passwordValida = await bcrypt.compare(data.password, usuario.passwordHash);
    if (!passwordValida) return { success: false, type: 'UNAUTHORIZED', message: 'Credenciales inválidas' };

    const accessToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    usuario.refreshToken = refreshToken;

    try {
      await this.usuariosRepository.update(usuario);
      return { success: true, data: { accessToken, refreshToken, usuario: { id: usuario.id, username: usuario.username } } };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async refresh(tokenRecibido: string) {
    let payload: any;
    try {
      payload = jwt.verify(tokenRecibido, process.env.JWT_REFRESH_SECRET as string) as { id: number };
    } catch (error) {
      return { success: false, type: 'FORBIDDEN', message: 'Token expirado o inválido' };
    }

    const usuario = await this.usuariosRepository.getById(payload.id);
    if (!usuario || usuario.refreshToken !== tokenRecibido) {
      return { success: false, type: 'FORBIDDEN', message: 'Refresh token inválido o revocado' };
    }

    const nuevoAccessToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    const nuevoRefreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    usuario.refreshToken = nuevoRefreshToken;

    try {
      await this.usuariosRepository.update(usuario);
      return { success: true, data: { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken } };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

  async logout(id: number) {
    const usuario = await this.usuariosRepository.getById(id);
    if (!usuario) return { success: false, type: 'NOT_FOUND', message: 'Usuario no encontrado' };

    usuario.refreshToken = null;

    try {
      await this.usuariosRepository.update(usuario);
      return { success: true };
    } catch (error) {
      return { success: false, type: 'DB_ERROR' };
    }
  }

}

export default AuthService;