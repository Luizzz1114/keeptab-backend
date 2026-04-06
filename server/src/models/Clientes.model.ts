import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Ventas from './Ventas.model';

@Entity()
class Clientes {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ unique: true })
  declare cedula: string;

  @Column()
  declare nombre: string;

  @Column({ nullable: true })
  declare contacto: string;

  @OneToMany(() => Ventas, (venta) => venta.cliente)
  declare ventas: Ventas[];

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}

export default Clientes;