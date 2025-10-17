import { Router } from 'express';
import { getEmpleados, moverEmpleado, createEmpleado, deleteEmpleado, updateEmpleado, getHistorialTraslados, getEmpleadoById} from '../controllers/empleados.controller';

const router = Router();

router.get('/empleados', getEmpleados);
router.get('/empleados/:id/historial', getHistorialTraslados);
router.patch('/empleados/:id/mover', moverEmpleado);
router.put('/empleados/:id', updateEmpleado);
router.post('/empleados', createEmpleado);
router.delete('/empleados/:id', deleteEmpleado);
router.get('/empleados/:id', getEmpleadoById);
export default router;