import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Edificio } from '../entities/Edificio';
import { Dependencia } from '../entities/Dependencia';
import { Empleado } from '../entities/Empleado'

const edificioRepo = AppDataSource.getRepository(Edificio);
const dependenciaRepo = AppDataSource.getRepository(Dependencia);
const empleadoRepo = AppDataSource.getRepository(Empleado);


export const getEdificios = async (req: Request, res: Response) => {
    try {
        const edificios = await edificioRepo.find();
        res.status(200).json(edificios);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createEdificio = async (req: Request, res: Response) => {
    try {
        const nuevoEdificio = edificioRepo.create(req.body);
        await edificioRepo.save(nuevoEdificio);
        res.status(201).json(nuevoEdificio);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el edificio' });
    }
};

export const updateEdificio = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const edificio = await edificioRepo.findOneBy({ id });
    if (!edificio) {
      return res.status(404).json({ message: 'Edificio no encontrado' });
    }
    edificioRepo.merge(edificio, req.body);
    await edificioRepo.save(edificio);
    res.status(200).json(edificio);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el edificio' });
  }
};

export const deleteEdificio = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const dependenciasCount = await dependenciaRepo.count({ where: { edificio: { id } } });
    if (dependenciasCount > 0) {
      return res.status(400).json({ message: 'No se puede eliminar el edificio porque tiene dependencias asociadas.' });
    }
    await edificioRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el edificio' });
  }
};

export const getEmpleadosPorEdificio = async (req: Request, res: Response) => {
    try {
        const edificioId = parseInt(req.params.id, 10);
        if (isNaN(edificioId)) {
            return res.status(400).json({ message: 'El ID del edificio no es válido.' });
        }
        
        const empleados = await empleadoRepo.find({
            where: {            
                dependencia: {
                    edificio: {
                        id: edificioId,
                    },
                },
            },            
            relations: ['dependencia'], 
        });
        return res.status(200).json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados por edificio:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const getEdificioById = async (req: Request, res: Response) => {
    try {
        const edificioId = parseInt(req.params.id, 10);
        if (isNaN(edificioId)) {
            return res.status(400).json({ message: 'El ID del edificio no es válido.' });
        }

        const edificioRepo = AppDataSource.getRepository(Edificio);
        const edificio = await edificioRepo.findOneBy({ id: edificioId });

        if (!edificio) {
            return res.status(404).json({ message: 'Edificio no encontrado.' });
        }

        return res.status(200).json(edificio);

    } catch (error) {
        console.error("Error al obtener edificio:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};