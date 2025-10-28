import React from 'react';
import { Table, Button, Modal, Select, Form, Input, Tooltip, Divider } from 'antd';
import { PlusOutlined, SaveOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEmpleados } from '../hooks/useEmpleados';
import { getEmpleadosColumns } from '../components/columnasEmpleados';

const { Option } = Select;

export const PaginaEmpleados: React.FC = () => {
    const {
        empleados, dependencias, isMoveModalVisible, selectedEmpleado, targetDependencia,
        isEditCreateModalVisible, editingEmpleado, isSubmitting, form,
        handleMoveClick, handleOkMove, setIsMoveModalVisible, setTargetDependencia,
        showEditCreateModal, handleCancel, handleFinish, handleDelete
    } = useEmpleados();

    const columns = getEmpleadosColumns({ handleMoveClick, showEditCreateModal, handleDelete });

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