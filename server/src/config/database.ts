import 'dotenv/config';
import { DataSource } from 'typeorm';
import Productos from '../models/Productos.model';
import Clientes from '../models/Clientes.model';
import Ventas from '../models/Ventas.model';
import DetallesVentas from '../models/Detalles.ventas.model';
import Abonos from '../models/Abonos.model';
import Jornadas from '../models/Jornadas.model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  logging: true,
  entities: [Productos, Clientes, Ventas, DetallesVentas, Abonos, Jornadas],
  synchronize: false
});