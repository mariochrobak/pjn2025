import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tooltip, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, TeamOutlined} from '@ant-design/icons';
import { getDependencias, createDependencia, updateDependencia, deleteDependencia, getEdificios } from '../services/api';
import { type Dependencia, type Edificio } from '../types/types';

const { Option } = Select;

export const PaginaDependencias: React.FC = () => {
  const [dependencias, setDependencias] = useState<Dependencia[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDependencia, setEditingDependencia] = useState<Dependencia | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const [depsRes, edisRes] = await Promise.all([getDependencias(), getEdificios()]);
      setDependencias(depsRes.data);
      setEdificios(edisRes.data);
    } catch (error: any) {
      message.error('Error al cargar los datos', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowModal = (dependencia?: Dependencia) => {
    if (dependencia) {
      setEditingDependencia(dependencia);
      const formValues = {
        nombre: dependencia.nombre,
        numeroOficina: dependencia.numeroOficina, 
        edificio_id: dependencia.edificio?.id,     
      }
      form.setFieldsValue(formValues);
    } else {
      setEditingDependencia(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDependencia(null);
    form.resetFields();
  };

  const handleFinish = async (values: Omit<Dependencia, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (editingDependencia) {
        await updateDependencia(editingDependencia.id, values);
        message.success('Dependencia actualizada exitosamente');
      } else {
        await createDependencia(values);
        message.success('Dependencia creada exitosamente');
      }
      handleCancel();
      fetchData();
    } catch (error: any) {
      message.error('Error al guardar la dependencia');
    } finally {
    setIsSubmitting(false); 
    }

  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Confirma que desea eliminar esta dependencia?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteDependencia(id);
          message.success('Dependencia eliminada exitosamente');
          fetchData();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al eliminar la dependencia';
          message.error(errorMessage);
        }
      },
    });
  };

  const columns: ColumnsType<Dependencia> = [
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

  return (
    <>      
      <Tooltip title="Agregar dependencia" color="blue" placement="right">
        <Button type="primary" icon={<PlusOutlined/>} onClick={() => handleShowModal()} style={{ marginBottom: 16 }}/>
      </Tooltip>
      <Table dataSource={dependencias} columns={columns} rowKey="id" />
      <Modal 
        title={editingDependencia ? 'Editar Dependencia' : 'Crear Nueva Dependencia'} 
        open={isModalVisible} 
        onCancel={handleCancel} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="numeroOficina" label="N° de Oficina">
            <Input />
          </Form.Item>
          <Form.Item name="edificio_id" label="Edificio" rules={[{ required: true }]}>
            <Select placeholder="Seleccione un edificio">
              {edificios.map(edificio => (
                <Option key={edificio.id} value={edificio.id}>{edificio.nombre}</Option>
              ))}
            </Select>
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