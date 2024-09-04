import React, { useState } from 'react';
import TableHorWithFilters from '../../../components/Table/TableHorWithFilters'; // Ajusta la ruta según sea necesario
import useAuth from '../../../hooks/useAuth';
import ButtonRed from '../../../components/ButtonRed';
import User from "../../../assets/Icons/Buttons/User.png"
import UserDown from "../../../assets/Icons/Buttons/UserDown.png"
import { useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
const ListUsers = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const urlToUpdateStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_USER_STATUS}`

    const { authData } = useAuth();
    const navigate = useNavigate();

    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'username_user', label: 'Nombre de usuario' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'value_ed', label: 'Nro. Documento' },
        { field: 'value_ec', label: 'Contacto' },
        { field: 'file_employee', label: 'Legajo' },
        { field: 'name_occupation', label: 'Ocupación' },
        { field: 'salary_occupation', label: 'Salario' },
        { field: 'name_department', label: 'Departamento' },
        { field: 'status_user', label: 'Estado' },
    ];

    const filterConfigs = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}` // URL para obtener las opciones de ocupación 
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT}` // URL para obtener las opciones de departamento
        }
    ];

    const searchOptions = [
        { value: 'username_user', label: 'Nombre de usuario' },
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
        { value: 'value_ed', label: 'Nro. Documento' },
        { value: 'value_ec', label: 'Contacto' },
        { value: 'file_employee', label: 'Legajo' },
        { value: 'name_occupation', label: 'Ocupación' },
        { value: 'salary_occupation', label: 'Salario' },
        { value: 'name_department', label: 'Departamento' },
        { value: 'status_user', label: 'Estado' },
    ];


    const navigateProfile = (row) => {
        navigate("/profile", { state: { value_user: row.id_user } })
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
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <TableHorWithFilters
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_entity'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_entity', order: 'ASC' }}
                actions={{
                    view: navigateProfile,
                    edit: (row) => console.log("Editar", row),
                    delete: updateStatus,
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: true
                }}
                actionColumn='id_user'
                title_table={"Personal"}
                paginationLabelInfo={"Usuarios"}
                buttonOneInfo={{ img: User, color: "blue", title: "Ver" }}
                buttonTreeInfo={{ img: UserDown, color: "black", title: "Dar de baja" }}
                isStatusUpdated={isStatusUpdated}
            />


        </>

    );
}
export default ListUsers;
