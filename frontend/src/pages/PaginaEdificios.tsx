import React from 'react';
import { Table, Button, Modal, Form, Input, Tooltip, Divider } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useEdificios } from '../hooks/useEdificios';
import { getEdificiosColumns } from '../components/columnasEdificios';

export const PaginaEdificios: React.FC = () => {
    // Obtenemos toda la lógica y los datos desde nuestro hook
    const {
        edificios, isModalVisible, editingEdificio, isSubmitting, form,
        handleShowModal, handleCancel, handleFinish, handleDelete
    } = useEdificios();

    // Obtenemos la configuración de las columnas, pasándole los handlers
    const columns = getEdificiosColumns({ handleShowModal, handleDelete });

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