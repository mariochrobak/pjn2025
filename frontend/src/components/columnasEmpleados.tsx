import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRightOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import type { Empleado } from '../types/types';

interface Handlers {
    handleMoveClick: (empleado: Empleado) => void;
    showEditCreateModal: (empleado: Empleado) => void;
    handleDelete: (id: number) => void;
}

export const getEmpleadosColumns = ({ handleMoveClick, showEditCreateModal, handleDelete }: Handlers): ColumnsType<Empleado> => [
      {title: 'Legajo', dataIndex: 'legajo', key: 'legajo', sorter: (a: Empleado, b: Empleado) => {const legajoA = parseInt(a.legajo, 10) || 0; const legajoB = parseInt(b.legajo, 10) || 0; return legajoA - legajoB;}, defaultSortOrder: 'ascend'},
      {title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a: Empleado, b: Empleado) => a.nombre.localeCompare(b.nombre)},
      {title: 'Apellido', dataIndex: 'apellido', key: 'apellido', sorter: (a: Empleado, b: Empleado) => a.apellido.localeCompare(b.apellido)},
      {title: 'DNI', dataIndex: 'dni', key: 'dni', sorter: (a: Empleado, b: Empleado) => {const dniA = parseInt(a.dni, 10) || 0; const dniB = parseInt(b.dni, 10) || 0; return dniA - dniB;}},
      {title: 'Dependencia', dataIndex: ['dependencia', 'nombre'], key: 'dependencia', sorter: (a: Empleado, b: Empleado) => (a.dependencia?.nombre || '').localeCompare(b.dependencia?.nombre || '')},
      {title: 'Edificio', dataIndex: ['dependencia', 'edificio', 'nombre'], key: 'edificio', sorter: (a: Empleado, b: Empleado) => (a.dependencia?.edificio?.nombre || '').localeCompare(b.dependencia?.edificio?.nombre || '')},
      {
        title: 'Acciones',
        key: 'acciones',
        render: (_: any, record: Empleado) => (
          <Space size="small">
            <Button title="Trasladar" type="primary" icon={<ArrowRightOutlined />} onClick={() => handleMoveClick(record)}/>
            <Button title="Editar" type="primary" icon={<EditOutlined />} onClick={() =>showEditCreateModal(record)}/>
            <Button title="Eliminar" type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}/>
            <Link to={`/empleados/${record.id}/historial`}>
              <Button title="Historial de traslados" type="primary"  icon={<HistoryOutlined />} style={{backgroundColor: '#faad14'}}/>
            </Link>
          </Space>
        ),
      },
    ];