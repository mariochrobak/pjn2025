import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getEmpleadosPorEdificio, getEmpleadosPorDependencia, getEdificioById, getDependenciaById } from '../services/api';
import { type Empleado } from '../types/types';

const { Title } = Typography;

export const PaginaEmpleadosPorFiltro: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [titulo, setTitulo] = useState('');    

    const params = useParams();
    const location = useLocation(); 

    useEffect(() => {
        const fetchData = async () => {
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
            } catch (error: any) {
                message.error('Error al cargar la lista de empleados ' + error);
            }
        };

        fetchData();
    }, [location.pathname, params]);

  const columns: ColumnsType<Empleado> = [
      {title: 'Legajo', dataIndex: 'legajo', key: 'legajo', sorter: (a: Empleado, b: Empleado) => {const legajoA = parseInt(a.legajo, 10) || 0; const legajoB = parseInt(b.legajo, 10) || 0; return legajoA - legajoB;}, defaultSortOrder: 'ascend'},
      {title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a: Empleado, b: Empleado) => a.nombre.localeCompare(b.nombre)},
      {title: 'Apellido', dataIndex: 'apellido', key: 'apellido', sorter: (a: Empleado, b: Empleado) => a.apellido.localeCompare(b.apellido)},
      {title: 'DNI', dataIndex: 'dni', key: 'dni', sorter: (a: Empleado, b: Empleado) => {const dniA = parseInt(a.dni, 10) || 0; const dniB = parseInt(b.dni, 10) || 0; return dniA - dniB;}},      
      
      /* Las siguientes columnas prodrían omitirse ya que resultan redundantes dado que el lista está filtrado. */
      
      {title: 'Dependencia', dataIndex: ['dependencia', 'nombre'], key: 'dependencia', sorter: (a: Empleado, b: Empleado) => (a.dependencia?.nombre || '').localeCompare(b.dependencia?.nombre || '')},
      {title: 'Edificio', dataIndex: ['dependencia', 'edificio', 'nombre'], key: 'edificio', sorter: (a: Empleado, b: Empleado) => (a.dependencia?.edificio?.nombre || '').localeCompare(b.dependencia?.edificio?.nombre || '')},
    ];
    return (
        <div>
            <Title level={4}>{titulo}</Title>
            <Table 
                dataSource={empleados} 
                columns={ columns } 
                rowKey="id" 
            />
        </div>
    );
};