import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dependencia } from './Dependencia';

@Entity('Empleados')
export class Empleado {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    legajo!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column({ unique: true })
    dni!: string;

    @ManyToOne(() => Dependencia, (dependencia) => dependencia.empleados, { eager: true })
    @JoinColumn({ name: 'dependencia_id' })
    dependencia!: Dependencia;
}