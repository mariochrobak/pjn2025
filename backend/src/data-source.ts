import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Empleado } from './entities/Empleado';
import { Dependencia } from './entities/Dependencia';
import { Edificio } from './entities/Edificio';
import { HistorialTraslados } from './entities/HistorialTraslados';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    //database: ':memory:',  
    database: './src/pjn.db', // Se adjunta base con datos de prueba para el modo de desarrollo
    //synchronize: false,  // ¡No usar en producción!
    logging: false,
    entities: [Empleado, Dependencia, Edificio, HistorialTraslados], 
    migrations: [],
    subscribers: [],
});