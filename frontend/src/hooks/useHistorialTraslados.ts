import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getHistorialTraslados, getEmpleadoById } from '../services/api';
import type { HistorialTraslado, Empleado } from '../types/types';

export const useHistorialTraslados = () => {
    // Estados
    const [historial, setHistorial] = useState<HistorialTraslado[]>([]);
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    const [loading, setLoading] = useState(true);

    // Hook de React Router para obtener el ID
    const { empleadoId } = useParams<{ empleadoId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            if (!empleadoId) return;
            setLoading(true);
            try {
                // Hacemos ambas peticiones en paralelo para mayor eficiencia
                const [historialResponse, empleadoResponse] = await Promise.all([
                    getHistorialTraslados(empleadoId),
                    getEmpleadoById(empleadoId)
                ]);
                setHistorial(historialResponse.data);
                setEmpleado(empleadoResponse.data);
            } catch (error) {
                message.error('Error al cargar el historial de traslados');
            } finally {
                setLoading(false); // Aseguramos que el loading termine, incluso si hay un error
            }
        };

        fetchData();
    },