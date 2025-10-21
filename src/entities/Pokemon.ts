import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('pokemons')
export class Pokemon {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Index({ unique: true })
  @Column()
  uid!: string;

  @Column()
  name!: string;

  @Column()
  type!: 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'rock' | 'ground' | 'flying' | 'psychic' | 'normal';

  @Column()
  hp!: number;

  @Column()
  attack!: number;

  @Column()
  defense!: number;

  @Column()
  speed!: number;
}
