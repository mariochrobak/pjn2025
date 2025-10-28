import React from 'react';
import { Table, Button, Modal, Form, Input, Select, Tooltip, Divider } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useDependencias } from '../hooks/useDependencias';
import { getDependenciasColumns } from '../components/columnasDependencias';

const { Option } = Select;

export const PaginaDependencias: React.FC = () => {
    // Obtenemos toda la lógica y los datos desde nuestro hook
    const {
        dependencias, edificios, isModalVisible, editingDependencia, isSubmitting, form,
        handleShowModal, handleCancel, handleFinish, handleDelete
    } = useDependencias();

    // Obtenemos la configuración de las columnas, pasándole los handlers
    const columns = getDependenciasColumns({ handleShowModal, handleDelete });

    return (
        <>
            <Tooltip title="Agregar dependencia" color="blue" placement="right">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowModal()} style={{ marginBottom: 16 }} />
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
                    <Divider />
                    <div className="modal-buttons">
                        <Tooltip title="Guardar" color="blue" placement="bottom">
                            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={isSubmitting} />
                        </Tooltip>
                    </div>
                </Form>
            </Modal>
        </>
    );
};