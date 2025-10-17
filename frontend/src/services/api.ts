import axios from 'axios';
import { type Empleado } from '../types/types';
import { type Dependencia } from '../types/types'; 
import { type Edificio } from '../types/types';

// Defino el punto de entrada de la api que será redireccionada al backend
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


export type NewEmpleado = Omit<Empleado, 'id'>;
export interface MovimientoPayload {
  dependenciaDestinoId: number;
}

export const getEmpleados = () => apiClient.get<Empleado[]>('/empleados');
export const getEmpleadoById = (id: string) => { return apiClient.get(`/empleados/${id}`);};
export const createEmpleado = (empleadoData: NewEmpleado) => apiClient.post<Empleado>('/empleados', empleadoData);
export const deleteEmpleado = (id: number) => apiClient.delete(`/empleados/${id}`);
export const updateEmpleado = (id: number, data: Omit<Empleado, 'id'>) => apiClient.put<Empleado>(`/empleados/${id}`, data);
export const moverEmpleado = (empleadoId: number, payload: MovimientoPayload) => apiClient.patch(`/empleados/${empleadoId}/mover`, payload);
export const getHistorialTraslados = (empleadoId: string) => { return apiClient.get(`/empleados/${empleadoId}/historial`);};

export const getDependencias = () => apiClient.get<Dependencia[]>('/dependencias');
export const createDependencia = (data: Omit<Dependencia, 'id'>) => apiClient.post<Dependencia>('/dependencias', data);
export const updateDependencia = (id: number, data: Omit<Dependencia, 'id'>) => apiClient.put<Dependencia>(`/dependencias/${id}`, data);
export const deleteDependencia = (id: number) => apiClient.delete(`/dependencias/${id}`);
export const getEmpleadosPorDependencia = (dependenciaId: string) => { return apiClient.get(`/dependencias/${dependenciaId}/empleados`);};
export const getDependenciaById = (id: string) => apiClient.get(`/dependencias/${id}`);

export const getEdificios = () => apiClient.get<Edificio[]>('/edificios');
export const createEdificio = (data: Omit<Edificio, 'id'>) => apiClient.post<Edificio>('/edificios', data);
export const updateEdificio = (id: number, data: Omit<Edificio, 'id'>) => apiClient.put<Edificio>(`/edificios/${id}`, data);
export const deleteEdificio = (id: number) => apiClient.delete(`/edificios/${id}`);
export const getEmpleadosPorEdificio = (edificioId: string) => { return apiClient.get(`/edificios/${edificioId}/empleados`); };
export const getEdificioById = (id: string) => apiClient.get(`/edificios/${id}`);

