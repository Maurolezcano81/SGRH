import { useState } from 'react';

const AuditCard = ({ audit, labelMapping }) => {
    const [isExpanded, setIsExpanded] = useState(false);


    const formatDateToDDMMYYYYHHMMSS = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexed
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const getTitle = () => {
        const userName = ` ${audit.parsedUserAction?.name_entity} ${audit.parsedUserAction?.lastname_entity}` || 'Usuario desconocido';

        if (audit.action_context === 'reEnter_employee') {
            return `${userName} volvió a ingresar al sistema a un empleado - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
        }

        if (audit.action_context === 'termination_employee') {
            return `${userName} despidio a un empleado - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
        }

        if (audit.action_context === 'leave_request') {
            return `${userName} Solicito una Licencia - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
        }

        if (audit.action_context === 'leave_response_request') {
            return `${userName} Respondio una Solicitud de Licencia - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
        }

        if (audit.action_context === 'delete_response_request') {
            return `${userName} Elimino una Respuesta de Licencia - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
        }


        const tableTitle = (() => {
            switch (audit.table_affected_ag) {
                case 'termination_employee':
                    return 'Despido de Empleado';
                case 'satisfaction_questionnaire':
                    return 'Cuestionario de Satisfacción';
                case 'evaluation_performance':
                    return 'Cuestionario de Desempeño';
                case 'entity_department_occupation':
                    return 'Rotación de personal';
                case 'employee':
                    return 'Empleado';
                default:
                    return 'Tabla desconocida';
            }
        })();

        const actionText = (() => {
            switch (audit.action_executed_ag) {
                case 'C':
                    return 'Agregó un/una';
                case 'D':
                    return 'Eliminó un/una';
                case 'U':
                    return 'Actualizó un/una';
                default:
                    return 'realizó una acción en';
            }
        })();

        return `${userName} ${actionText} ${tableTitle} - ${formatDateToDDMMYYYYHHMMSS(audit.created_at)}`;
    };

    const getActionText = () => {
        switch (audit.action_executed_ag) {
            case 'C':
                return 'Creación';
            case 'D':
                return 'Eliminación';
            case 'U':
                return 'Actualización';
            default:
                return 'Acción Desconocida';
        }
    };

    const handleToggle = () => {
        setIsExpanded(prev => !prev);
    };

    const profileExecuterPicture = `${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}/${audit.parsedUserAction?.avatar_user}`;

    const profilePrevPicture = `${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}/${audit.parsedPrevData?.avatar_user}`;

    const profileActualPicture = `${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}/${audit.parsedActualData?.avatar_user}`;


    return (
        <div className='audit__card'>
            <div className='audit__title' onClick={handleToggle}>

                <div className='audit__title__container'>
                    <div className='audit__profile__container'>
                        <img className='audit__user__profile' src={profileExecuterPicture} alt="" />
                    </div>

                    <h4>{getTitle()}</h4>
                </div>



                {isExpanded ?
                    <p className='non-expanded'>Ocultar</p>
                    :
                    <p className='expanded'>Ver más</p>

                }
            </div>

            {isExpanded && (
                <div className='audit__content'>
                    <p className='audit__label'>
                        {labelMapping.id_affected_ag}: <span className='audit__label__info'>{audit.id_affected_ag}</span>
                    </p>
                    <p className='audit__label'>
                        {labelMapping.table_affected_ag}: <span className='audit__label__info'>{audit.table_affected_ag}</span>
                    </p>
                    <p className='audit__label'>
                        {labelMapping.action_executed_ag}: <span className='audit__label__info'>{getActionText()}</span>
                    </p>

                    <div className='audit__content__divider__container'>


                        {Object.entries(audit.parsedPrevData).length > 0 && (
                            <>
                                <h5>Datos Anteriores:</h5>
                                <div className='audit__content__divider'>
                                    {Object.entries(audit.parsedPrevData).map(([key, value]) => (

                                        key === 'avatar_user' ?

                                            <div className='audit__profile__container'>
                                                <p key={key} className=''>
                                                    Foto de la persona:
                                                </p>
                                                <img className='audit__user__profile' src={profilePrevPicture} alt="" />
                                            </div>
                                            :
                                            <p key={key} className='audit__label'>
                                                {labelMapping[key] || key}: <span className='audit__label__info'>{value}</span>
                                            </p>
                                    ))}
                                </div>
                            </>

                        )}



                        <h5>Datos Actuales:</h5>
                        <div className='audit__content__divider'>
                            {Object.entries(audit.parsedActualData).map(([key, value]) => (
                                key === 'avatar_user' ?

                                    <div className='audit__profile__container'>
                                        <p key={key} className=''>
                                            Foto de la persona:
                                        </p>
                                        <img className='audit__user__profile' src={profileActualPicture} alt="" />
                                    </div>
                                    :
                                    <p key={key} className='audit__label'>
                                        {labelMapping[key] || key}: <span className='audit__label__info'>{value}</span>
                                    </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditCard;
