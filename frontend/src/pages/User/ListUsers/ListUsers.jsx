import React, { useEffect, useState } from 'react';
import TableHorWithFilters from '../../../components/Table/TableHorWithFilters'; // Ajusta la ruta según sea necesario
import useAuth from '../../../hooks/useAuth';
import ButtonRed from '../../../components/ButtonRed';
import User from "../../../assets/Icons/Buttons/User.png"
import UserDown from "../../../assets/Icons/Buttons/UserDown.png"
import { useLocation, useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbsContext';
import ResponsiveTable from '../../../components/Table/ResponsiveTable';

const ListUsers = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();
  
    useEffect(() => {
      updateBreadcrumbs([
        { name: 'Ver Personal', url: '/rrhh/personal/ver' },
      ]);
    }, [location.pathname]);

    const columns = [
        { field: 'username_user', label: 'Nombre de usuario' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'value_ed', label: 'Nro. Documento' },
        { field: 'value_ec', label: 'Contacto' },
        { field: 'file_employee', label: 'Legajo' },
        { field: 'name_occupation', label: 'Ocupación' },
        { field: 'salary_occupation', label: 'Salario' },
        { field: 'name_department', label: 'Departamento' },
        { field: 'name_tse', label: 'Estado' },
    ];

    const filterConfigs = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}` // URL para obtener las opciones de ocupación 
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}` // URL para obtener las opciones de departamento
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
        { value: 'name_tse', label: 'Estado' },
    ];


    const navigateProfile = (row) => {
        navigate("/profile", { state: { value_user: row.id_user } })
        console.log(row.id_user)
    };

    const updateStatus = async (row) => {
        const updatedStatus = row.status === 1 ? 0 : 1;
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
                        status: updatedStatus
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

    const addButtonTitle = () => {
        navigate('/rrhh/personal/crear');
        console.log('hola')
    }


    return (
        <div className=''>
            <div className='container__content'>
                {successMessage && <AlertSuccesfully message={successMessage} />}
                {errorMessage && <ErrorMessage message={errorMessage} />}

                <ResponsiveTable
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
                        delete: (row) => console.log("Editar", row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false
                    }}
                    actionColumn='id_user'
                    title_table={"Listado de Personal"}
                    paginationLabelInfo={"Usuarios"}
                    buttonOneInfo={{ img: User, color: "blue", title: "Ver" }}
                    buttonTreeInfo={{ img: UserDown, color: "black", title: "Dar de baja" }}
                    isStatusUpdated={isStatusUpdated}
                

                    titleInfo={[
                        { field: "avatar_user", type: "field" },
                        { field: "name_entity", type: "field" },
                        { field: "lastname_entity", type: "field" },

                    ]}
                    headerInfo={
                        ["Nombre y Apellido"]
                    }

                />
            </div>


        </div>

    );
}
export default ListUsers;
