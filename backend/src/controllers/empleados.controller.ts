import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Empleado } from '../entities/Empleado';
import { Dependencia } from '../entities/Dependencia';
import { HistorialTraslados } from '../entities/HistorialTraslados';

const empleadoRepo = AppDataSource.getRepository(Empleado);

export const getEmpleados = async (req: Request, res: Response) => {
    try {
        const empleados = await empleadoRepo.find({ relations: ['dependencia'] });
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createEmpleado = async (req: Request, res: Response) => {
    try {
        const dependencia = await AppDataSource.getRepository(Dependencia).findOneBy({ id: req.body.dependencia_id });
        if (!dependencia) {
            return res.status(404).json({ message: 'Dependencia no encontrada' });
        }
        
        const nuevoEmpleado = empleadoRepo.create({ ...req.body, dependencia });
        await empleadoRepo.save(nuevoEmpleado);
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el empleado' });
    }
};

export const moverEmpleado = async (req: Request, res: Response) => {
    const empleadoId = parseInt(req.params.id);
    const { dependenciaDestinoId } = req.body;

    try {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const empleado = await transactionalEntityManager.findOne(Empleado, {
                where: { id: empleadoId },
                relations: ['dependencia']
            });

            if (!empleado) throw new Error('Empleado no encontrado');

            const dependenciaDestino = await transactionalEntityManager.findOneBy(Dependencia, { id: dependenciaDestinoId });
            if (!dependenciaDestino) throw new Error('Dependencia de destino no encontrada');

            const dependenciaOrigen = empleado.dependencia;

             empleado.dependencia = dependenciaDestino;
            await transactionalEntityManager.save(empleado);

            const historial = new HistorialTraslados();
            historial.empleado = empleado;
            historial.dependenciaOrigen = dependenciaOrigen;
            historial.dependenciaDestino = dependenciaDestino;            
            await transactionalEntityManager.save(historial);
        });

        res.status(200).json({ message: 'Empleado movido exitosamente.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error al mover el empleado' });
    }
};

export const deleteEmpleado = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const empleado = await empleadoRepo.findOneBy({ id });
        if (!empleado) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const historialRepo = AppDataSource.getRepository(HistorialTraslados);
        
        // Opción 1: No eliminar al empleado cuando tiene historial de traslados
        
        const countHistorial = await historialRepo.count({ where: { empleado: { id } } });
        if (countHistorial > 0) {
          return res.status(400).json({ message: 'No se puede eliminar el empleado porque tiene historial de traslados.' });
        }

        // Opción 2: Eliminar al empleado y todos su historial de traslados
        /*
        
        await historialRepo.delete({empleado : {id}})
        */
        await empleadoRepo.remove(empleado);

        res.status(204).send();         
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el empleado'});
    }
};

export const updateEmpleado = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { legajo, nombre, apellido, dni, dependencia_id } = req.body;

  if (!legajo || !nombre || !apellido || !dni || !dependencia_id) {
    return res.status(400).json({ message: 'Legajo, nombre, apellido, DNi ydependencia son requeridos' });
  }

  try {
    const dependenciaRepo = AppDataSource.getRepository(Dependencia)
    const empleado = await empleadoRepo.findOneBy({ id });
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const dependencia = await dependenciaRepo.findOneBy({ id: dependencia_id });
    if (!dependencia) {
      return res.status(404).json({ message: 'La dependencia especificada no existe' });
    }

    empleado.legajo = legajo;
    empleado.nombre = nombre;
    empleado.apellido = apellido;
    empleado.dni = dni;
    empleado.dependencia = dependencia;

    await empleadoRepo.save(empleado); 
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el empleado' });
  }
}

export const getHistorialTraslados = async (req: Request, res: Response) => {
    try {        
        const empleadoId = parseInt(req.params.id, 10);
        if (isNaN(empleadoId)) 
            return res.status(400).json({ message: 'El ID del empleado no es válido.' });
        const empleado = await empleadoRepo.findOneBy({ id: empleadoId });
        if (!empleado) 
            return res.status(404).json({ message: 'Empleado no encontrado.' });
    
        const trasladoRepo = AppDataSource.getRepository(HistorialTraslados);
        const traslados = await trasladoRepo.find(
            {
            where: {
                empleado: {
                id: empleadoId, 
                },            
            },            
            relations: ['dependenciaOrigen', 'dependenciaDestino'],
            }        
        )
        res.status(200).json(traslados);
    } catch (error) {        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getEmpleadoById = async (req: Request, res: Response) => {
  try {
    const empleadoId = parseInt(req.params.id, 10);
    if (isNaN(empleadoId)) {
      return res.status(400).json({ message: 'El ID del empleado no es válido.' });
    }

    const empleadoRepo = AppDataSource.getRepository(Empleado);
    const empleado = await empleadoRepo.findOneBy({ id: empleadoId });

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }

    return res.status(200).json(empleado);

  } catch (error) {
    console.error("Error al obtener empleado:", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};