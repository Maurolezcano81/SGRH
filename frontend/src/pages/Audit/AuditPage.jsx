import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import PreferenceTitle from '../MasterTables/PreferenceTitle';
import AuditCard from './AuditCard';

const AuditPage = () => {
    const { authData } = useAuth();
    const { updateBreadcrumbs } = useBreadcrumbs();
    const [auditData, setAuditData] = useState([]);
    const [processedAuditData, setProcessedAuditData] = useState([]);

    const [initialPagination] = useState({ limit: 10, offset: 0 });
    const [pagination, setPagination] = useState(initialPagination);
    const [totalResults, setTotalResults] = useState(0);



    useEffect(() => {
        updateBreadcrumbs([{ name: 'Datos de Auditoria', url: '/admin/auditoria' }]);
    }, []);

    const getAll = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_AUDIT}`;

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await fetch(getAll, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${authData.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        limit: pagination.limit,
                        offset: pagination.offset,
                        filters: {},
                        order: 'DESC',
                        orderBy: 'id_ag'
                    })
                });

                const data = await response.json();
                setAuditData(data.list || []);
                setTotalResults(data.total || 0)
            } catch (error) {
                console.error('Error fetching audit data:', error);
            }
        };

        fetchAuditData();
    }, [authData.token, pagination]);

    useEffect(() => {
        const processAuditData = auditData.map(audit => ({
            ...audit,
            parsedPrevData: formatDatesInObject(audit.prev_data_ag ? JSON.parse(audit.prev_data_ag) : {}),
            parsedActualData: formatDatesInObject(audit.actual_data_ag ? JSON.parse(audit.actual_data_ag) : {}),
            parsedUserAction: audit.user_id_ag ? JSON.parse(audit.user_id_ag) : {}
        }));
        setProcessedAuditData(processAuditData);
    }, [auditData]);

    // Función para formatear fechas
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Paginación
    const totalPages = Math.ceil(totalResults / pagination.limit) || 1;
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    const handlePagination = (newOffset) => {
        setPagination(prev => ({ ...prev, offset: newOffset }));
    };

    const labelMapping = {
        // Header Map
        table_affected_ag: "Tabla Afectada",
        action_executed_ag: "Acción efectuada",
        id_affected_ag: "Nro de Registro Afectado",
        // Fin Header Map

        // Questionaires
        id_sq: 'Nro de Registro del Cuestionario',
        name_sq: 'Nombre del Cuestionario',
        id_ep: 'Nro de Registro del Cuestionario',
        name_ep: 'Nombre del Cuestionario',
        start_sq: 'Inicia el',
        end_sq: 'Termina el',
        start_ep: 'Inicia el',
        end_ep: 'Termina el',
        created_at: 'Creado el',
        quantity_questions: 'Cantidad Inicial de Preguntas',

        // IDS
        id_user: 'Nro de Registro en la tabla de Usuario',
        id_tot: 'Ultimo Nro De Registro en la tabla de Despidos',

        // User
        username_user: 'Nombre del usuario',
        status_user: 'Estado del usuario',

        // Entity
        name_entity: "Nombre de la persona",
        lastname_entity: 'Apellido de la persona',
        status_entity: 'Estado de la persona',


        // Employee
        file_employee: 'Nro de Legajo del empleado',
        name_tse: 'Nombre del estado del empleado',
        id_edo: 'Nro de Registro en la tabla de Departamentos/Ocupaciones',
        status_employee: 'Estado del empleado',

        // Termination
        description_tot: "Causa del Despido",

        // Leaves Request
        id_lr: 'Nro de Registro en la Tabla de Solicitud de Licencias',
        name_tol: 'Tipo de Licencia',
        reason_lr: 'Razón ampliada',
        start_lr: 'Inicio de Licencia',
        end_lr: 'Fin de Licencia',  

        // Leave Response Request
        id_lrr: 'Nro de Registro en la Tabla de Respuesta de Licencia',
        name_sr: 'Estado de la Solicitud'
    };

    const formatDatesInObject = (data) => {
        if (!data) return {};
        const formattedData = { ...data };

        ['created_at', 'start_sq', 'end_sq', 'start_ep', 'end_ep', 'start_lr', 'end_lr'].forEach(key => {
            if (formattedData[key]) {
                formattedData[key] = formatDate(formattedData[key]);
            }
        });

        return formattedData;
    };


    return (
        <div className="container__page">
            <PreferenceTitle title={"Datos de Auditoria"} />

            <div className='audits__container'>
                {processedAuditData.length > 0 ? (
                    processedAuditData.map((audit, index) => (
                        <AuditCard
                            key={index}
                            audit={audit}
                            labelMapping={labelMapping}
                        />
                    ))
                ) : (
                    <p>No hay datos disponibles</p>
                )}
            </div>

            <div className='table__primary__pagination'>
                <div className='table__primary__pagination__info'>
                    <p>{`Cantidad Total de Acciones: ${totalResults}`}</p>
                </div>

                <div className='table__primary__pagination__buttons'>
                    <div className='table__primary__pagination__back'>
                        <button
                            onClick={() => handlePagination(Math.max(0, pagination.offset - pagination.limit))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                    </div>

                    <span className='table__primary__pagination__current-page'>
                        {`${currentPage} de ${totalPages}`}
                    </span>

                    <div className='table__primary__pagination__next'>
                        <button
                            onClick={() => handlePagination(pagination.offset + pagination.limit)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditPage;
