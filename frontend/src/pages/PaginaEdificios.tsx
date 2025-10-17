import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, message, Space, Tooltip, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getEdificios, createEdificio, updateEdificio, deleteEdificio } from '../services/api';
import { type Edificio } from '../types/types';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, TeamOutlined} from '@ant-design/icons';
export const PaginaEdificios: React.FC = () => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEdificio, setEditingEdificio] = useState<Edificio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchEdificios = async () => {
    try {
      const response = await getEdificios();
      setEdificios(response.data);
    } catch (error: any) {
      message.error('Error al cargar los edificios');
    }
  };

  useEffect(() => {
    fetchEdificios();
  }, []);

  const handleShowModal = (edificio?: Edificio) => {
    if (edificio) {
      setEditingEdificio(edificio);
      form.setFieldsValue(edificio);
    } else {
      setEditingEdificio(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEdificio(null);
    form.resetFields();
  };

  const handleFinish = async (values: Omit<Edificio, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (editingEdificio) {
        await updateEdificio(editingEdificio.id, values);
        message.success('Edificio actualizado exitosamente');
      } else {
        await createEdificio(values);
        message.success('Edificio creado exitosamente');
      }
      handleCancel();
      fetchEdificios();
    } catch (error: any) {
      message.error('Error al guardar el edificio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Confirma que desea eliminar este edificio?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteEdificio(id);
          message.success('Edificio eliminado exitosamente');
          fetchEdificios();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al eliminar el edificio';
          message.error(errorMessage);
        }
      },
    });
  };

const getDireccionCompleta = (rec: Edificio): string => {
  const partePiso = rec.piso ? ` - Piso/Dpto: ${rec.piso}` : '';
  
  return `${rec.calle} ${rec.numero || ''}${partePiso}`.trim();
};
  const columns: ColumnsType<Edificio> = [
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

  return (
    <>
      <Tooltip title="Agregar Edificio" color="blue" placement="right">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowModal()} style={{ marginBottom: 16 }} />        
      </Tooltip>      
      <Table dataSource={edificios} columns={columns} rowKey="id" />
      <Modal 
        title={editingEdificio ? 'Editar Edificio' : 'Crear Nuevo Edificio'} 
        open={isModalVisible} 
        onCancel={handleCancel} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="calle" label="Calle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="numero" label="Número">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="piso" label="Piso / Depto">
            <Input />
          </Form.Item>
          <Divider/>
          <div className="modal-buttons">
            <Tooltip title="Guardar" color="blue" placement="bottom">
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={isSubmitting}/>
            </Tooltip>
          </div>
        </Form>
      </Modal>
    </>
  );
};