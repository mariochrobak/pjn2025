import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Select, message, Form, Input, Space, Tooltip, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRightOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, HistoryOutlined} from '@ant-design/icons';
import { getEmpleados, moverEmpleado, createEmpleado, type NewEmpleado, getDependencias, deleteEmpleado, updateEmpleado } from '../services/api';
import { type Empleado, type Dependencia } from '../types/types';

const { Option } = Select;



export const PaginaEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [dependencias, setDependencias] = useState<Dependencia[]>([]);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [targetDependencia, setTargetDependencia] = useState<number | null>(null);
  const [isEditCreateModalVisible, setIsEditCreateModalVisible] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadInitialData = async () => {
    try {
      const [empleadosResponse, dependenciasResponse] = await Promise.all([
        getEmpleados(),
        getDependencias()
      ]);
      setEmpleados(empleadosResponse.data);
      setDependencias(dependenciasResponse.data);
    } catch (error: any) {
      message.error('Error al cargar los datos iniciales');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleMoveClick = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setTargetDependencia(empleado.dependencia?.id || null)
    setIsMoveModalVisible(true);
  };

  const handleOkMove = async () => {
    if (!selectedEmpleado || !targetDependencia) return;
    setIsSubmitting(true);
    try {
      await moverEmpleado(selectedEmpleado.id, { dependenciaDestinoId: targetDependencia });
      message.success(`Empleado ${selectedEmpleado.nombre} ${selectedEmpleado.apellido} movido exitosamente.`);      
      loadInitialData();
    } catch (error: any) {
      message.error('No se pudo mover al empleado.');
    } finally {
      setIsMoveModalVisible(false);      
      setIsSubmitting(false);
      setSelectedEmpleado(null);
      setTargetDependencia(null);      
    }
  };

const showEditCreateModal = (empleado?: Empleado) => {
    if (empleado) {      
      setEditingEmpleado(empleado);
      form.setFieldsValue({
        legajo: empleado.legajo,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        dni: empleado.dni,
        dependencia_id: empleado.dependencia?.id,
      });
    } else {      
      setEditingEmpleado(null);
      form.resetFields();
    }
    setIsEditCreateModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsEditCreateModalVisible(false);
    setEditingEmpleado(null);
    form.resetFields();
  };
  

  const handleFinish = async (values: NewEmpleado) => {
    setIsSubmitting(true);
    try {
      if (editingEmpleado) {
        await updateEmpleado(editingEmpleado.id, values);
        message.success('Empleado actualizado exitosamente');
      } else {        
        await createEmpleado(values);
        message.success('Empleado creado exitosamente');
      }
      handleCancel();
      loadInitialData();
    } catch (error: any) {
      message.error(editingEmpleado ? 'Error al actualizar el empleado' : 'Error al crear el empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '¿Confirma que desea eliminar este empleado?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteEmpleado(id);
          message.success('Empleado eliminado exitosamente!!');
          loadInitialData();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al eliminar el empleado';
          message.error(errorMessage);
        }
      },
    });
  };

  const columns: ColumnsType<Empleado> = [
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

  return (
    <>


      <Tooltip title="Agregar empleado" color="blue" placement="right">
        <Button type="primary" icon={<PlusOutlined/>} onClick={() => showEditCreateModal()} style={{ marginBottom: 16 }}/>
      </Tooltip>
      <Table dataSource={empleados} columns={columns} rowKey="id" />
      
      <Modal
        title={`Trasladar a ${selectedEmpleado?.nombre} ${selectedEmpleado?.apellido}`}
        open={isMoveModalVisible}
        footer={null}
        onCancel={() => setIsMoveModalVisible(false)}
      >
        <p>Seleccione la nueva dependencia de destino:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Seleccionar dependencia"
          value={targetDependencia} 
          onChange={(value) => setTargetDependencia(value)}
        >
          {dependencias.map(dep => (
            <Option key={dep.id} value={dep.id}>{dep.nombre}</Option>
          ))}
        </Select>      
        <Divider/>
        <div className="modal-buttons">
          <Tooltip title="Trasladar" placement="bottom" color="blue">
            <Button type="primary" icon={<ArrowRightOutlined/>} onClick={handleOkMove} loading={isSubmitting} style={{ marginBottom: 16 }}/>
          </Tooltip>
      </div>
      </Modal>

      <Modal
        title={editingEmpleado ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
        open={isEditCreateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="legajo" label="Legajo" rules={[{ required: true, message: 'Por favor ingrese el legajo' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dni" label="DNI" rules={[{ required: true, message: 'Por favor ingrese el DNI' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dependencia_id" label="Dependencia" rules={[{ required: true, message: 'Por favor seleccione una dependencia' }]}>
            <Select 
              placeholder="Seleccionar dependencia"
              
              // La dependencia no se puede editar. Para modificarla, se debe realizar un traslado.
              disabled={!!editingEmpleado}    
            >
              {dependencias.map(dep => (
                <Option key={dep.id} value={dep.id}>{dep.nombre}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
          <Divider/>
          <div className="modal-buttons">
            <Tooltip title="Guardar" color="blue" placement="bottom">
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={isSubmitting}/>
            </Tooltip>
          </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};