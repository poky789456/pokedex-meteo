import { DataSource } from 'typeorm';
import { Pokemon } from '../entities/Pokemon';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'pokedex';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: MONGO_URL,
  database: MONGO_DB,
  entities: [Pokemon],
  synchronize: true,
  logging: false
});

export async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('MongoDB connecté via TypeORM');
  }
}
