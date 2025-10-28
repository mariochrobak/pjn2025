import type { ColumnsType } from 'antd/es/table';
import type { Empleado } from '../types/types';

export const getColumnasFiltradas = (tipoFiltro: 'edificio' | 'dependencia'): ColumnsType<Empleado> => {
    const todasLasColumnas: ColumnsType<Empleado> = [
        { title: 'Legajo', dataIndex: 'legajo', key: 'legajo', sorter: (a, b) => (parseInt(a.legajo, 10) || 0) - (parseInt(b.legajo, 10) || 0), defaultSortOrder: 'ascend' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a, b) => a.nombre.localeCompare(b.nombre) },
        { title: 'Apellido', dataIndex: 'apellido', key: 'apellido', sorter: (a, b) => a.apellido.localeCompare(b.apellido) },
        { title: 'DNI', dataIndex: 'dni', key: 'dni', sorter: (a, b) => (parseInt(a.dni, 10) || 0) - (parseInt(b.dni, 10) || 0) },
        { title: 'Dependencia', dataIndex: ['dependencia', 'nombre'], key: 'dependencia', sorter: (a, b) => (a.dependencia?.nombre || '').localeCompare(b.dependencia?.nombre || '') },
        { title: 'Edificio', dataIndex: ['dependencia', 'edificio', 'nombre'], key: 'edificio', sorter: (a, b) => (a.dependencia?.edificio?.nombre || '').localeCompare(b.dependencia?.edificio?.nombre || '') },
    ];

    // Filtramos las columnas redundantes
    if (tipoFiltro === 'dependencia') {
        // Si filtramos por dependencia, los campos "Dependencia" y "Edificio" son redundantes
        return todasLasColumnas.filter(col => col.key !== 'dependencia' && col.key !== 'edificio');
    }
    
    if (tipoFiltro === 'edificio') {
        // Si filtramos por edificio, el campo "Edificio" es redundante
        return todasLasColumnas.filter(col => col.key !== 'edificio');
    }

    return todasLasColumnas;
};