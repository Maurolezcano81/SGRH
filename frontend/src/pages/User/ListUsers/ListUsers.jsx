import React from 'react';
import TableHorWithFilters from '../../../components/Table/TableHorWithFilters'; // Ajusta la ruta según sea necesario
import useAuth from '../../../hooks/useAuth';
import ButtonRed from '../../../components/ButtonRed';

const ListUsers = () => {
    const { authData } = useAuth();

    const columns = [
        {field: 'avatar_user', label: ''},
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


    const viewAction = (row) => {
        alert(`Ver detalles de: ${row.name}`);
    };

    const editAction = (row) => {
        alert(`Editar: ${row.name}`);
    };

    const deleteAction = (row) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar a ${row.name}?`)) {
            alert(`Eliminado: ${row.name}`);
        }
    };

    const handleModalAdd = () => {
        console.log('add');
    }

    return (
        <TableHorWithFilters
            url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER}`}
            authToken={authData.token}
            columns={columns}
            filterConfigs={filterConfigs}
            searchOptions={searchOptions}
            initialSearchField={'name_entity'}
            initialSearchTerm={''}
            initialSort={{ field: 'name_entity', order: 'ASC' }}
            actions={{
                view: (row) => console.log("Ver", row),
                edit: (row) => console.log("Editar", row),
                delete: (row) => console.log("Eliminar", row.id_user),
            }}
            showActions={{
                view: true,
                edit: false,
                delete: true
            }}
            actionColumn='id_user'
            handleModalAdd={handleModalAdd}
            title_table={"Personal"}
            paginationLabelInfo={"Usuarios"}
        />
    );
};

export default ListUsers;
