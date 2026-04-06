import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Clientes from './Clientes.model';
import DetallesVentas from './Detalles.ventas.model';
import Abonos from './Abonos.model';

@Entity()
class Ventas {
  @PrimaryGeneratedColumn()
  declare id: number;  

  @Column('decimal', { precision: 10, scale: 2 })
  declare total: number;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  declare fecha: Date;

  @Column()
  declare estatus: string;

  @ManyToOne(() => Clientes, (cliente) => cliente.ventas, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  declare cliente: Clientes;

  @OneToMany(() => DetallesVentas, (detalle) => detalle.venta, { cascade: true })
  declare detalles_venta: DetallesVentas[];

  @OneToMany(() => Abonos, (abono) => abono.venta)
  declare abonos: Abonos[];

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}

export default Ventas;