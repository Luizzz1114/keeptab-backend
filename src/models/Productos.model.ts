import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DetallesVenta from './Detalles_venta.model';

@Entity()
class Productos {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ unique: true })
  declare nombre: string;

  @Column({ default: 'Otros' })
  declare categoria: string;

  @Column('decimal', { precision: 10, scale: 2 })
  declare precio: number;

  @Column({ default: false })
  declare conteo: boolean;

  @Column({ default: 0 })
  declare stock: number;

  @OneToMany(() => DetallesVenta, (detalle) => detalle.producto)
  declare detalles_venta: DetallesVenta[];

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @DeleteDateColumn()
  declare deleted_at: Date;
}

export default Productos;