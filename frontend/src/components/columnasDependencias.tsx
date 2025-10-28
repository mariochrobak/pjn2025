import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import type { Dependencia } from '../types/types';

interface Handlers {
    handleShowModal: (dependencia: Dependencia) => void;
    handleDelete: (id: number) => void;
}

export const getDependenciasColumns = ({ handleShowModal, handleDelete }: Handlers): ColumnsType<Dependencia> => [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a: Dependencia, b: Dependencia) => a.nombre.localeCompare(b.nombre), defaultSortOrder: 'ascend'},
    { title: 'Oficina', dataIndex: 'numeroOficina', key: 'numeroOficina', sorter: (a: Dependencia, b: Dependencia) => a.nombre.localeCompare(b.nombre) },
    { title: 'Edificio', dataIndex: ['edificio', 'nombre'], key: 'edificio_id', sorter: (a: Dependencia, b: Dependencia) => (a.edificio?.nombre || '').localeCompare(b.edificio?.nombre || '') },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Dependencia) => (
        <Space size="small">
          <Button title="Editar" type="primary" icon={<EditOutlined />} onClick={() => handleShowModal(record)}/>
          <Button title="Eliminar" type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}/>
            <Link to={`/dependencias/${record.id}/empleados`}>
                <Button title="Empleados de la dependencia" type="primary" icon={<TeamOutlined />}  style={{backgroundColor: '#faad14'}} />
            </Link>
        </Space>
      ),
    },
  ];
