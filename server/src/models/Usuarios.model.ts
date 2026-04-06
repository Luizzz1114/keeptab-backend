import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
class Usuarios {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ unique: true })
  declare username: string;

  @Column()
  declare nombre: string;

  @Column({ select: false }) 
  declare passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  declare refreshToken: string | null;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @DeleteDateColumn()
  declare deleted_at: Date;
}

export default Usuarios;