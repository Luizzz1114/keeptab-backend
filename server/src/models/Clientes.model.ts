import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Ventas from './Ventas.model';

@Entity()
class Clientes {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare cedula: string;

  @Column()
  declare nombre: string;

  @Column({ nullable: true })
  declare contacto: string;

  @OneToMany(() => Ventas, (venta) => venta.cliente)
  declare ventas: Ventas[];

  @CreateDateColumn({ name: 'created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  declare updatedAt: Date;
}

export default Clientes;