import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DetallesVentas from './Detalles.ventas.model';

@Entity()
class Productos {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  declare precio: number;

  @Column({ default: false })
  declare conteo: boolean;

  @Column({ default: 0 })
  declare stock: number;

  @OneToMany(() => DetallesVentas, (detalle) => detalle.producto)
  declare detalles_venta: DetallesVentas[];

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @DeleteDateColumn()
  declare deleted_at: Date;
}

export default Productos;