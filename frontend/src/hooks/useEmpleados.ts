
import { useState, useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { getEmpleados, getDependencias, moverEmpleado, createEmpleado, updateEmpleado, deleteEmpleado, type NewEmpleado } from '../services/api';
import type { Empleado, Dependencia } from '../types/types';

export const useEmpleados = () => {
    // Estados
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [dependencias, setDependencias] = useState<Dependencia[]>([]);
    const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
    const [targetDependencia, setTargetDependencia] = useState<number | null>(null);
    const [isEditCreateModalVisible, setIsEditCreateModalVisible] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Carga de datos inicial
    const loadInitialData = async () => {
        try {
            const [empleadosRes, dependenciasRes] = await Promise.all([getEmpleados(), getDependencias()]);
            setEmpleados(empleadosRes.data);
            setDependencias(dependenciasRes.data);
        } catch (error) {
            message.error('Error al cargar los datos iniciales');
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    // Manejadores de eventos (Handlers)
    const handleMoveClick = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setTargetDependencia(empleado.dependencia?.id || null);
        setIsMoveModalVisible(true);
    };

    const handleOkMove = async () => {
        if (!selectedEmpleado || !targetDependencia) return;
        setIsSubmitting(true);
        try {
            await moverEmpleado(selectedEmpleado.id, { dependenciaDestinoId: targetDependencia });
            message.success(`Empleado ${selectedEmpleado.nombre} movido exitosamente.`);
            loadInitialData();
        } catch (error) {
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
            form.setFieldsValue({ ...empleado, dependencia_id: empleado.dependencia?.id });
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
        } catch (error) {
            message.error(editingEmpleado ? 'Error al actualizar' : 'Error al crear');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '¿Confirma que desea eliminar este empleado?',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteEmpleado(id);
                    message.success('Empleado eliminado exitosamente');
                    loadInitialData();
                } catch (error: any) {
                    message.error(error.response?.data?.message || 'Error al eliminar');
                }
            },
        });
    };

    // Devolvemos todo lo que la vista necesita
    return {
        empleados,
        dependencias,
        isMoveModalVisible,
        selectedEmpleado,
        targetDependencia,
        isEditCreateModalVisible,
        editingEmpleado,
        isSubmitting,
        form,
        handleMoveClick,
        handleOkMove,
        setIsMoveModalVisible,
        setTargetDependencia,
        showEditCreateModal,
        handleCancel,
        handleFinish,
        handleDelete
    };
};