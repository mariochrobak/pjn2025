import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { HistorialTraslado } from '../types/types';

export const columnasHistorial: ColumnsType<HistorialTraslado> = [
    {
        title: 'Fecha y Hora',
        dataIndex: 'fechaTraslado',
        key: 'fecha',
        render: (isoString: string) => dayjs(isoString).format('DD/MM/YYYY - HH:mm'),
        sorter: (a, b) => new Date(a.fechaTraslado).getTime() - new Date(b.fechaTraslado).getTime(),
        defaultSortOrder: 'descend', // Ordenamos por la más reciente por defecto
    },
    {
        title: 'Dependencia Origen',
        dataIndex: ['dependenciaOrigen', 'nombre'],
        key: 'origen',
        sorter: (a, b) => (a.dependenciaOrigen?.nombre || '').localeCompare(b.dependenciaOrigen?.nombre || ''),
    },
    {
        title: 'Dependencia Destino',
        dataIndex: ['dependenciaDestino', 'nombre'],
        key: 'destino',
        sorter: (a, b) => (a.dependenciaDestino?.nombre || '').localeCompare(b.dependenciaDestino?.nombre || ''),
    },
];