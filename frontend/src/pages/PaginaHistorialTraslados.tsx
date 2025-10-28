import React from 'react';
import { Table, Typography, Spin } from 'antd';
import { useHistorialTraslados } from '../hooks/useHistorialTraslados';
import { columnasHistorial } from '../components/columnasHistorial';

const { Title } = Typography;

export const PaginaHistorialTraslados: React.FC = () => {
    // Obtenemos toda la lógica y datos desde nuestro hook
    const { historial, empleado, loading } = useHistorialTraslados();

    // Mostramos un spinner mientras los datos se están cargando
    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
    }

    return (
        <div>
            <Title level={4}>
                Historial de Traslados de {empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado'}
            </Title>
            <Table
                dataSource={historial}
                columns={columnasHistorial}
                rowKey="id"
            />
        </div>
    );
};