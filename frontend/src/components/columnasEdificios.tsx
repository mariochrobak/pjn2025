import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import type { Edificio } from '../types/types';

// Interfaz para tipar los handlers que recibe la función
interface Handlers {
    handleShowModal: (edificio: Edificio) => void;
    handleDelete: (id: number) => void;
}

// Función auxiliar para formatear la dirección
const getDireccionCompleta = (rec: Edificio): string => {
    const partePiso = rec.piso ? ` - Piso/Dpto: ${rec.piso}` : '';
    return `${rec.calle} ${rec.numero || ''}${partePiso}`.trim();
};

export const getEdificiosColumns = ({ handleShowModal, handleDelete }: Handlers): ColumnsType<Edificio> => [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a :Edificio, b: Edificio) => a.nombre.localeCompare(b.nombre)},
    {
    title: 'Dirección', key: 'direccion', sorter: 
      (a: Edificio, b: Edificio) => getDireccionCompleta(a).localeCompare(getDireccionCompleta(b)),
    render: (_: any, rec: Edificio) => getDireccionCompleta(rec),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Edificio) => (
        <Space size="small">
          <Button title="Editar" type="primary" icon={<EditOutlined />} onClick={() => handleShowModal(record)}/>
          <Button title="Eliminar" type="primary" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}/>                     
            <Link to={`/edificios/${record.id}/empleados`}>
                <Button title="Empleados del edificio" type="primary" icon={<TeamOutlined />}  style={{backgroundColor: '#faad14'}} />
            </Link>
        </Space>
      ),
    },
  ];