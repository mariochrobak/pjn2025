import React from 'react';
import { Table, Typography } from 'antd';
import { useEmpleadosPorFiltro } from '../hooks/useEmpleadosPorFiltro';
import { getColumnasFiltradas } from '../components/columnasEmpleadosFiltrados';

const { Title } = Typography;

export const PaginaEmpleadosPorFiltro: React.FC = () => {
    // Obtenemos toda la lógica y datos desde nuestro hook
    const { empleados, titulo, loading, location } = useEmpleadosPorFiltro();

    // Determinamos el tipo de filtro para pasar a la función de columnas
    const tipoFiltro = location.pathname.includes('/edificios/') ? 'edificio' : 'dependencia';
    const columns = getColumnasFiltradas(tipoFiltro);

     return (
        <div>
            <Title level={4}>{titulo}</Title>
            <Table
                dataSource={empleados}
                columns={columns}
                rowKey="id"
            />
        </div>
    );
};