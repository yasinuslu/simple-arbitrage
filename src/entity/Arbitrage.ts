import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Arbitrage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'timestamptz' })
  public startTime: Date;

  @Column({ type: 'timestamptz' })
  public endTime: Date;

  @Column({ type: 'numeric' })
  public btEthTrySell: number;

  @Column({ type: 'numeric' })
  public btEthTryBuy: number;

  @Column({ type: 'numeric' })
  public usdTrySell: number;

  @Column({ type: 'numeric' })
  public usdTryBuy: number;

  @Column({ type: 'numeric' })
  public btEthUsdSell: number;

  @Column({ type: 'numeric' })
  public btEthUsdBuy: number;

  @Column({ type: 'numeric' })
  public binanceEthUsdSell: number;

  @Column({ type: 'numeric' })
  public binanceEthUsdBuy: number;

  @Column({ type: 'numeric' })
  public profitRate: number;

  @Column({ type: 'numeric' })
  public returnRate: number;

  @Column({ type: 'numeric' })
  public targetEthAmount: number;

  @Column({ type: 'numeric' })
  public changeThreshold: number;

  @Column({ type: 'numeric' })
  public minProfitRate: number;

  @Column({ type: 'numeric' })
  public minReturnRate: number;
}

export default Arbitrage;
