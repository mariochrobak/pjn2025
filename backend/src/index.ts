import 'reflect-metadata'; 
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';


import empleadosRoutes from './routes/empleados.routes';
import dependenciasRoutes from './routes/dependencias.routes';
import edificiosRoutes from './routes/edificios.routes';

AppDataSource.initialize()
    .then(() => {
        const app = express();
        const PORT = 3001;

        app.use(express.json());

        app.use('/api', edificiosRoutes);
        app.use('/api', empleadosRoutes);
        app.use('/api', dependenciasRoutes);
        
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });

    })
    .catch((error) => console.log("Error al conectar con la base de datos:", error));