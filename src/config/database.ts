import 'dotenv/config';
import { DataSource } from 'typeorm';
import Productos from '../models/Productos.model';
import Clientes from '../models/Clientes.model';
import Ventas from '../models/Ventas.model';
import DetallesVenta from '../models/Detalles_venta.model';
import Abonos from '../models/Abonos.model';
import Jornadas from '../models/Jornadas.model';
import Usuarios from '../models/Usuarios.model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Productos, Clientes, Ventas, DetallesVenta, Abonos, Jornadas, Usuarios],
  synchronize: true,
  logging: false,
  ssl: { rejectUnauthorized: false }
});