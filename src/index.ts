import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('➜ Conexión a la base de datos establecida');
  } catch (error: any) {
    console.error('➜ Error al conectar a la base de datos');
  }
  app.listen(PORT, () => {
    console.log(`➜ API funcionando en el puerto http://localhost:${PORT}`);
  });
}

main();