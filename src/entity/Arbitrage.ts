import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Arbitrage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;
}

export default Arbitrage;
