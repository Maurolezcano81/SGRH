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
import ModalLabelSelect from '../../../components/Modals/Updates/ModalLabelSelect';
import MoveOtherDepartment from './MoveOtherDepartment';



const DepartmentView = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const [isModalRotationOpen, setModalRotationOpen] = useState(false);
    const [isModalAddEdoIsOpen, setIsModalAddEdoIsOpen] = useState(false);

    const [isModalMoveOtherDepartmentActive, setIsModalMoveOtherDepartmentActive] = useState(false);


    const [employeeData, setEmployeeData] = useState({})


    const [isModalRotationUpdated, setIsModalRotationUpdated] = useState(false);

    const [dataToUpdate, setDataToUpdate] = useState({
        id_edo: "",
        department_fk: "",
        occupation_fk: ""
    })


    const { authData } = useAuth();
    const location = useLocation();

    const navigate = useNavigate();

    const { id_department, name_department } = location.state || {};


    
    const [dataToMoveOtherDepartment, setDataToMoveOtherDepartment] = useState({
        id_edo: "",
        department: id_department,
        entity_fk: "",
        occupation_fk: "",
    })
    const urlToUpdateStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_INFO}`

    const urlToGetEmployeesOutDepartment = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.R_DEPARTMENT_EMPLOYEES_OUT}/${id_department}`
    const urlToRotateEmployee = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.R_DEPARTMENT_INSERT_EMPLOYEE}`



    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_occupation', label: 'Puesto' },
        { field: 'file_employee', label: 'Legajo' },
        { field: 'salary_occupation', label: 'Salario' },
    ];

    const filterConfigs = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`
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


    const toggleModalRotationPersonal = (row) => {
        setModalRotationOpen(!isModalRotationOpen);
    }

    const updateModalRotationPersonal = () =>{
        setIsModalRotationUpdated(!isModalRotationUpdated)

        setIsStatusUpdated(!isStatusUpdated);
    }

    const toggleModalMoveOtherDepartment = (row) =>{
        setIsModalMoveOtherDepartmentActive(!isModalMoveOtherDepartmentActive);
        setDataToMoveOtherDepartment({
            id_edo: row.id_edo,
            department_fk: id_department,
            entity_fk: row.id_entity,
            occupation_fk: row.occupation_fk
        })
    }

    const updateMoveOtherDepartment = ()=>{
        setIsStatusUpdated(!isStatusUpdated);
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
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`
        },
    ];

    const searchOptionsToModal = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
    ]


    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`


    const toggleAddModal = (row) => {
        setIsModalAddEdoIsOpen(!isModalAddEdoIsOpen)
        setDataToUpdate(
            {
                id_edo: row.id_edo,
                entity_fk: row.id_entity,
                occupation_fk: row.occupation_fk,
                department_fk: id_department
            }
        )
    }

    return (
        <div className='container__page'>
            <div className='container__content'>
                <PreferenceTitle
                    title={name_department}
                    titleButton={"Agregar Personal"}
                    onClick={toggleModalRotationPersonal}
                />
            </div>


            {isModalMoveOtherDepartmentActive && (
                <MoveOtherDepartment 
                personal={dataToMoveOtherDepartment}
                department={id_department}
                updateProfile={updateMoveOtherDepartment}
                handleSingleCloseModal={toggleModalMoveOtherDepartment}
                />
            )}

            {isModalRotationOpen && (
                <>
                    {isModalAddEdoIsOpen && (
                        <ModalLabelSelect
                            initialData={dataToUpdate}
                            handleCloseModal={toggleAddModal}
                            urlForSelect={urlSelect}
                            urlUpdate={urlToRotateEmployee}
                            updateProfile={updateModalRotationPersonal}
                            selectField={{
                                name: 'occupation_fk',
                                placeholder: 'Puesto de trabajo',
                                optionKey: 'id_occupation',
                                optionValue: 'id_occupation',
                                optionLabel: 'name_occupation'
                            }}
                            labelText={"Puesto de Trabajo: "}
                        />
                    )}

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
                            view: toggleAddModal,
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
                        isStatusUpdated={isModalRotationUpdated}
                        handleCloseModal={toggleModalRotationPersonal}
                        title_table={"Lista de Empleados"}
                        colorTable={'bg__green-5'}
                    />
                </>

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
                    edit: toggleModalMoveOtherDepartment,
                    delete: (row) => console.log('Editar', row),
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
