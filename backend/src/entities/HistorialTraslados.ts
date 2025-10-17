import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Empleado } from './Empleado';
import { Dependencia } from './Dependencia';

@Entity('Historial_Traslados')
export class HistorialTraslados {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Empleado , { eager: true })
    @JoinColumn({ name: 'empleado_id' })
    empleado!: Empleado;

    @ManyToOne(() => Dependencia, { eager: true })
    @JoinColumn({ name: 'dependencia_origen_id' })
    dependenciaOrigen!: Dependencia;

    @ManyToOne(() => Dependencia, { eager: true })
    @JoinColumn({ name: 'dependencia_destino_id' })
    dependenciaDestino!: Dependencia;

    @CreateDateColumn({ name: 'fecha_traslado' })
    fechaTraslado!: Date;
}