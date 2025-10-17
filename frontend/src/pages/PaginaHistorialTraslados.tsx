import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom'; 
import { Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getHistorialTraslados, getEmpleadoById } from '../services/api'; 
import { type HistorialTraslado, type Empleado } from '../types/types'; 

const { Title } = Typography;

export const PaginaHistorialTraslados: React.FC = () => {
  
  const [historial, setHistorial] = useState<HistorialTraslado[]>([]);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  const { empleadoId } = useParams<{ empleadoId: string }>();

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!empleadoId) return; 
      try {
        const [historialResponse, empleadoResponse] = await Promise.all([getHistorialTraslados(empleadoId) , getEmpleadoById(empleadoId)]);        
        setHistorial(historialResponse.data);
        setEmpleado(empleadoResponse.data);
      } catch (error: any) {
        message.error('Error al cargar el historial de traslados');
      }
    };

    fetchHistorial();
  }, [empleadoId]); 

const columns: ColumnsType<HistorialTraslado>  = [
    { 
        title: 'Fecha', 
        dataIndex: 'fechaTraslado', 
        key: 'fecha',
        render: (isoString: string) => {
            return dayjs(isoString).format('DD/MM/YYYY - HH:mm');
        },        
        sorter: (a: HistorialTraslado, b: HistorialTraslado) => new Date(a.fechaTraslado).getTime() - new Date(b.fechaTraslado).getTime(),
        defaultSortOrder: 'ascend'
    },
    { 
        title: 'Dependencia Origen', 
        dataIndex: ['dependenciaOrigen', 'nombre'], 
        key: 'origen',        
        sorter: (a: HistorialTraslado, b: HistorialTraslado) => (a.dependenciaOrigen?.nombre || '').localeCompare(b.dependenciaOrigen?.nombre || ''),
    },
    { 
        title: 'Dependencia Destino', 
        dataIndex: ['dependenciaDestino', 'nombre'], 
        key: 'destino',        
        sorter: (a: HistorialTraslado, b: HistorialTraslado) => (a.dependenciaDestino?.nombre || '').localeCompare(b.dependenciaDestino?.nombre || ''),
    },
    ];
  return (
    <div>
      <Title level={4}>Historial de Traslados de {empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado'}</Title>      
      <Table 
        dataSource={historial} 
        columns={columns} 
        rowKey="id"
      />
    </div>
  );
};