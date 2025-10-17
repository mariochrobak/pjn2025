import { Router } from 'express';
import { getDependencias, createDependencia, updateDependencia, deleteDependencia, getEmpleadosPorDependencia, getDependenciaById  } from '../controllers/dependencias.controller';

const router = Router();

router.get('/dependencias', getDependencias);
router.get('/dependencias/:id/empleados', getEmpleadosPorDependencia);
router.get('/dependencias/:id', getDependenciaById);
router.post('/dependencias', createDependencia);
router.put('/dependencias/:id', updateDependencia);
router.delete('/dependencias/:id', deleteDependencia);

export default router;