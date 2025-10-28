import { useState, useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { getDependencias, getEdificios, createDependencia, updateDependencia, deleteDependencia } from '../services/api';
import type { Dependencia, Edificio } from '../types/types';

export const useDependencias = () => {
    // Estados
    const [dependencias, setDependencias] = useState<Dependencia[]>([]);
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDependencia, setEditingDependencia] = useState<Dependencia | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Carga de datos
    const fetchData = async () => {
        try {
            const [depsRes, edisRes] = await Promise.all([getDependencias(), getEdificios()]);
            setDependencias(depsRes.data);
            setEdificios(edisRes.data);
        } catch (error) {
            message.error('Error al cargar los datos');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Manejadores de eventos (Handlers)
    const handleShowModal = (dependencia?: Dependencia) => {
        if (dependencia) {
            setEditingDependencia(dependencia);
            form.setFieldsValue({
                nombre: dependencia.nombre,
                numeroOficina: dependencia.numeroOficina,
                edificio_id: dependencia.edificio?.id,
            });
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
        } catch (error) {
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
                    const errorMessage = error.response?.data?.message || 'Error al eliminar';
                    message.error(errorMessage);
                }
            },
        });
    };

    // Devolvemos todo lo que la vista necesita
    return {
        dependencias,
        edificios,
        isModalVisible,
        editingDependencia,
        isSubmitting,
        form,
        handleShowModal,
        handleCancel,
        handleFinish,
        handleDelete
    };
};