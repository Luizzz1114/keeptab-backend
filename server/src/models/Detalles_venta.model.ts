import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Ventas from './Ventas.model';
import Productos from './Productos.model';

@Entity()
class DetallesVenta {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare cantidad: number;

  @Column('decimal', { name: 'precio_unitario', precision: 10, scale: 2 })
  declare precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  declare subtotal: number;

  @ManyToOne(() => Ventas, (venta) => venta.detalles_venta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  declare venta: Ventas;

  @ManyToOne(() => Productos, (producto) => producto.detalles_venta)
  @JoinColumn({ name: 'producto_id' })
  declare producto: Productos;

}

export default DetallesVenta;