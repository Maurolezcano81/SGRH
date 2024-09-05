import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import User from '../../../assets/Icons/Buttons/User.png'
import { useLocation, useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import TableSecondaryNotTitleAndWhereOnUrl from '../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl';
import PreferenceTitle from '../../MasterTables/PreferenceTitle';
const DepartmentView = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const urlToUpdateStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_INFO}`

    const { authData } = useAuth();
    const location = useLocation();

    const navigate = useNavigate();

    const { id_department, name_department } = location.state || {};

    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_occupation', label: 'Puesto' },
        { field: 'file_employee', label: 'Legajo' },
        { field: 'status_employee', label: 'Estado del Empleado' },
        { field: 'salary_occupation', label: 'Salario' },
    ];

    const filterConfigs = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}`
        },
    ];

    const searchOptions = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
    ];


    const navigateProfile = (row) => {
        navigate('/profile', { state: { value_user: row.id_user } })
        console.log(row.id_user)
    };

    const updateStatus = async (row) => {
        const updatedStatus = row.status_user === 1 ? 0 : 1;
        try {
            const fetchResponse = await fetch(urlToUpdateStatus, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(
                    {
                        id_user: row.id_user,
                        status_user: updatedStatus
                    }
                ),
            });

            const data = await fetchResponse.json();

            if (!fetchResponse.ok) {
                setErrorMessage(data.message);
                return;
            }

            setSuccessMessage(data.message);
            setIsStatusUpdated(!isStatusUpdated)
            setTimeout(() => {
                setSuccessMessage('');
            }, 800);
        } catch (error) {
            console.log('Error al actualizar el estado', error);
            setErrorMessage('Error al actualizar el estado');
        }
    };

    const deleteAction = (row) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar a ${row.name}?`)) {
            alert(`Eliminado: ${row.name}`);
        }
    };

    const addButtonTitle = () => {
        navigate('/rrhh/personal/crear');
        console.log('hola')
    }

    return (
        <div className='container__page'>
            <div className='container__content'>
                <PreferenceTitle
                    title={name_department}
                    titleButton={"Agregar Personal"}
                />
            </div>

            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_INFO}/${id_department}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_entity'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_entity', order: 'ASC' }}
                actions={{
                    view: navigateProfile,
                    edit: (row) => console.log('Editar', row),
                    delete: updateStatus,
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_entity'
                paginationLabelInfo={'Empleados'}
                buttonOneInfo={{ img: User, color: 'blue', title: 'Ver Perfil' }}
                isStatusUpdated={isStatusUpdated}
            />


        </div>

    );
}
export default DepartmentView;
