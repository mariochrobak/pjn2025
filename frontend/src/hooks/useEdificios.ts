import { useState, useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { getEdificios, createEdificio, updateEdificio, deleteEdificio } from '../services/api';
import type { Edificio } from '../types/types';

export const useEdificios = () => {
    // Estados
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEdificio, setEditingEdificio] = useState<Edificio | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Carga de datos
    const fetchEdificios = async () => {
        try {
            const response = await getEdificios();
            setEdificios(response.data);
        } catch (error) {
            message.error('Error al cargar los edificios');
        }
    };

    useEffect(() => {
        fetchEdificios();
    }, []);

    // Manejadores de eventos (Handlers)
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
        } catch (error) {
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

    // Devolvemos todo lo que la vista necesita
    return {
        edificios,
        isModalVisible,
        editingEdificio,
        isSubmitting,
        form,
        handleShowModal,
        handleCancel,
        handleFinish,
        handleDelete
    };
};