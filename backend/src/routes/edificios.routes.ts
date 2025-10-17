import { Router } from 'express';
import { getEdificios, createEdificio, updateEdificio, deleteEdificio, getEmpleadosPorEdificio, getEdificioById } from '../controllers/edificios.controller';

const router = Router();

router.get('/edificios', getEdificios);
router.get('/edificios/:id/empleados', getEmpleadosPorEdificio);
router.get('/edificios/:id', getEdificioById);
router.post('/edificios', createEdificio);
router.put('/edificios/:id', updateEdificio);
router.delete('/edificios/:id', deleteEdificio);


export default router;