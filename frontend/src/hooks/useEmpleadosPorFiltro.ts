import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { getEmpleadosPorEdificio, getEmpleadosPorDependencia, getEdificioById, getDependenciaById } from '../services/api';
import type { Empleado } from '../types/types';

export const useEmpleadosPorFiltro = () => {
    // Estados
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [titulo, setTitulo] = useState('');
    const [loading, setLoading] = useState(true);

    // Hooks de React Router
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let empleadosResponse;
                let tituloResponse;
                
                if (location.pathname.includes('/edificios/')) {
                    const edificioId = params.edificioId!;
                    [empleadosResponse, tituloResponse] = await Promise.all([
                        getEmpleadosPorEdificio(edificioId),
                        getEdificioById(edificioId)
                    ]);
                    setTitulo(`Empleados en el Edificio: ${tituloResponse.data.nombre}`);
                } else {
                    const dependenciaId = params.dependenciaId!;
                    [empleadosResponse, tituloResponse] = await Promise.all([
                        getEmpleadosPorDependencia(dependenciaId),
                        getDependenciaById(dependenciaId)
                    ]);
                    setTitulo(`Empleados en la Dependencia: ${tituloResponse.data.nombre}`);
                }
                setEmpleados(empleadosResponse.data);
            } catch (error) {
                message.error('Error al cargar la lista de empleados');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.pathname, params]);

    // Devolvemos lo que la vista necesita
    return { empleados, titulo, loading, location };
};