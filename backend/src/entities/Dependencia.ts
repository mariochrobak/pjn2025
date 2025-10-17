import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Edificio } from './Edificio';
import { Empleado } from './Empleado';

@Entity('Dependencias')
export class Dependencia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ name: 'numero_oficina', nullable: true })
    numeroOficina!: string;

    @ManyToOne(() => Edificio, (edificio) => edificio.dependencias, { eager: true }) 
    @JoinColumn({ name: 'edificio_id' })
    edificio!: Edificio;

    @OneToMany(() => Empleado, (empleado) => empleado.dependencia)
    empleados!: Empleado[];
}