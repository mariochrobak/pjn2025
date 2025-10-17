import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dependencia } from './Dependencia';

@Entity('Edificios')
export class Edificio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    calle!: string;

    @Column({ nullable: true })
    numero!: number;

    @Column({ nullable: true })
    piso!: string;

    @OneToMany(() => Dependencia, (dependencia) => dependencia.edificio)
    dependencias!: Dependencia[];
}