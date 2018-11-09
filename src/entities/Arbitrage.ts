import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class Arbitrage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
}

export default Arbitrage;
