import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Arbitrage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'timestamptz' })
  public time: Date;

  // @Column()
  // public btcSell: number;
}

export default Arbitrage;
