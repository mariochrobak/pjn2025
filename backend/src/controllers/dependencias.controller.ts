import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Dependencia } from '../entities/Dependencia';
import { Edificio } from '../entities/Edificio';
import { Empleado } from '../entities/Empleado'


const dependenciaRepo = AppDataSource.getRepository(Dependencia);
const edificioRepo = AppDataSource.getRepository(Edificio);
const empleadoRepo = AppDataSource.getRepository(Empleado);

export const getDependencias = async (req: Request, res: Response) => {
  try {
    const dependencias = await dependenciaRepo.find({ relations: ['edificio'] });
    res.status(200).json(dependencias);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createDependencia = async (req: Request, res: Response) => {
  const { nombre, numero_oficina, edificio_id } = req.body;
  if (!nombre || !edificio_id) {
    return res.status(400).json({ message: 'Nombre y edificio son requeridos' });
  }

  try {
    const edificio = await edificioRepo.findOneBy({ id: edificio_id });
    if (!edificio) {
      return res.status(404).json({ message: 'El edificio especificado no existe' });
    }

    const nuevaDependencia = dependenciaRepo.create({
      nombre,
      numeroOficina: numero_oficina,
      edificio: edificio, 
    });

    await dependenciaRepo.save(nuevaDependencia);
    res.status(201).json(nuevaDependencia);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la dependencia' });
  }
};

export const updateDependencia = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, numero_oficina, edificio_id } = req.body;

  if (!nombre || !edificio_id) {
    return res.status(400).json({ message: 'Nombre y edificio son requeridos' });
  }

  try {
    const dependencia = await dependenciaRepo.findOneBy({ id });
    if (!dependencia) {
      return res.status(404).json({ message: 'Dependencia no encontrada' });
    }

    const edificio = await edificioRepo.findOneBy({ id: edificio_id });
    if (!edificio) {
      return res.status(404).json({ message: 'El edificio especificado no existe' });
    }

    dependencia.nombre = nombre;
    dependencia.numeroOficina = numero_oficina;
    dependencia.edificio = edificio;

    await dependenciaRepo.save(dependencia); 
    res.status(200).json(dependencia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la dependencia' });
  }
};

export const deleteDependencia = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const dependencia = await dependenciaRepo.findOneBy({ id });
    if (!dependencia) {
      return res.status(404).json({ message: 'Dependencia no encontrada' });
    }
    const countEmpleados = await empleadoRepo.count({ where: { dependencia: { id } } });
    if (countEmpleados > 0) {
      return res.status(400).json({ message: 'No se puede eliminar la dependencia porque tiene empleados asociados.' });
    }

    await dependenciaRepo.remove(dependencia);
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la dependencia' });
  }
};

export const getEmpleadosPorDependencia = async (req: Request, res: Response) => {
    try {
        const dependenciaId = parseInt(req.params.id, 10);
        if (isNaN(dependenciaId)) {
            return res.status(400).json({ message: 'El ID de la dependencia no es válido.' });
        }

        const empleados = await empleadoRepo.find({
            where: {
                dependencia: {
                    id: dependenciaId,
                },
            },
            relations: ['dependencia'],
        });

        return res.status(200).json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados por dependencia:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getDependenciaById = async (req: Request, res: Response) => {
    try {
        const dependenciaId = parseInt(req.params.id, 10);
        if (isNaN(dependenciaId)) {
            return res.status(400).json({ message: 'El ID de la dependencia no es válido.' });
        }

        const dependenciaRepo = AppDataSource.getRepository(Dependencia);
        const dependencia = await dependenciaRepo.findOneBy({ id: dependenciaId });

        if (!dependencia) {
            return res.status(404).json({ message: 'Dependencia no encontrada.' });
        }

        return res.status(200).json(dependencia);

    } catch (error) {
        console.error("Error al obtener dependencia:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};