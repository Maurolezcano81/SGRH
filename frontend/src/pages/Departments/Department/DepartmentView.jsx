import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import User from '../../../assets/Icons/Buttons/User.png'
import { useLocation, useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import TableSecondaryNotTitleAndWhereOnUrl from '../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl';
import PreferenceTitle from '../../MasterTables/PreferenceTitle';
import ModalTableWFilters from '../../../components/Modals/Updates/ModalTableWFilters';

import AddEmployee from '../../../assets/Icons/Buttons/AddEmployee.png';
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png';



const DepartmentView = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const [isModalRotationOpen, setModalRotationOpen] = useState(false);

    const { authData } = useAuth();
    const location = useLocation();

    const navigate = useNavigate();

    const { id_department, name_department } = location.state || {};


    const urlToUpdateStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_INFO}`

    const urlToGetEmployeesOutDepartment = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.R_DEPARTMENT_EMPLOYEES_OUT}/${id_department}`
    const urlToRotateEmployee = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.R_DEPARTMENT_INSERT_EMPLOYEE}`


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


    const toggleModalRotationPersonal = () => {
        setModalRotationOpen(!isModalRotationOpen);
    }


    const columsToModal = [
        { field: 'avatar_user', label: '' },
        { field: 'file_employee', label: 'Legajo' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_occupation', label: 'Puesto actual' },
        { field: 'name_department', label: 'Departamento actual' }
    ]


    const filtersToModal = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}`
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT}`
        },
    ];

    const searchOptionsToModal = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
    ]

    return (
        <div className='container__page'>
            <div className='container__content'>
                <PreferenceTitle
                    title={name_department}
                    titleButton={"Agregar Personal"}
                    onClick={toggleModalRotationPersonal}
                />
            </div>

            {isModalRotationOpen && (
                <ModalTableWFilters
                    url={urlToGetEmployeesOutDepartment}
                    authToken={authData.token}
                    columns={columsToModal}
                    filterConfigs={filtersToModal}
                    searchOptions={searchOptionsToModal}
                    initialSearchField={'name_entity'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_entity', order: 'ASC' }}
                    actions={{
                        view: toggleModalRotationPersonal,
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
                    buttonOneInfo={{ img: AddEmployee, color: 'blue', title: 'Agregar Personal' }}
                    isStatusUpdated={isStatusUpdated}
                    handleCloseModal={toggleModalRotationPersonal}
                    title_table={"Lista de Empleados"}
                    colorTable={'bg__green-5'}
                />
            )}

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
                    edit: true,
                    delete: false
                }}
                actionColumn='id_entity'
                paginationLabelInfo={'Empleados'}
                buttonOneInfo={{ img: User, color: 'blue', title: 'Ver Perfil' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
            />


        </div>

    );
}
export default DepartmentView;
