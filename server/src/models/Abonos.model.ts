import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Ventas from './Ventas.model';

@Entity()
class Abonos {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  declare fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  declare monto: number;

  @ManyToOne(() => Ventas, (venta) => venta.abonos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  declare venta: Ventas;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}

export default Abonos;