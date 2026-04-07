import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Ventas from './Ventas.model';

@Entity()
class Jornadas {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  declare apertura: Date;

  @Column({ type: 'timestamp', nullable: true })
  declare cierre: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  declare fondo_inicial: number;

  @Column({ default: 'ABIERTA' })
  declare estatus: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  declare total_ventas: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  declare total_fisico: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  declare diferencia: number;

  @OneToMany(() => Ventas, (venta) => venta.jornada)
  declare ventas: Ventas[];

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}

export default Jornadas;