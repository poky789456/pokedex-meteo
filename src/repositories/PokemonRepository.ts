import { MongoRepository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Pokemon } from '../entities/Pokemon';

export class PokemonRepository {
  private repo: MongoRepository<Pokemon>;

  constructor() {
    this.repo = AppDataSource.getMongoRepository(Pokemon);
  }

  findAll() {
    return this.repo.find();
  }

  findByUid(uid: string) {
    return this.repo.findOneBy({ uid });
  }

  create(p: Partial<Pokemon>) {
    return this.repo.create(p);
  }

  save(p: Pokemon) {
    return this.repo.save(p);
  }

  async updateByUid(uid: string, patch: Partial<Pokemon>) {
    const existing = await this.findByUid(uid);
    if (!existing) return null;
    Object.assign(existing, patch);
    return this.save(existing);
  }

  async deleteByUid(uid: string) {
    const existing = await this.findByUid(uid);
    if (!existing) return false;
    await this.repo.delete(existing._id);
    return true;
  }
}
