import React, { useState } from 'react';
import TableHorWithFilters from '../../components/Table/TableHorWithFilters'; // Ajusta la ruta según sea necesario
import useAuth from '../../hooks/useAuth';
import ButtonRed from '../../components/ButtonRed';
import SeeDepartment from "../../assets/Icons/Buttons/SeeDepartment.png"
import Edit from "../../assets/Icons/Preferences/Edit.png"
import { useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../components/Alerts/ErrorMessage';
import ModalUpdate from '../../components/Modals/ModalUpdate';
import ModalAdd from '../../components/Modals/ModalAdd';


const LisDepartment = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState(null);
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_DEPARTMENT}`
    const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_DEPARTMENT}`
    const createDepartment = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_DEPARTMENT}`


    const { authData } = useAuth();
    const navigate = useNavigate();

    const handleOpenModalAdd = () => {
        setIsModalAddOpen(!isModalAddOpen);
        setIsStatusUpdated(!isStatusUpdated)
    }

    const columns = [
        { field: 'name_department', label: "Departamento" },
        { field: 'quantity_department', label: "Cantidad de Empleados" },
        { field: 'salary_total_department', label: "Costo Total" },
    ];

    const filterConfigs = [
    ];

    const searchOptions = [
        { field: 'name_department', label: "Departamento" },
    ];


    const navigateDepartment = (row) => {
        navigate("departamento", { state: { id_department: row.id_department, name_department: row.name_department } })
    };

    const handleModalUpdate = async (row) => {
        setDepartmentToEdit(row.id_department);
        setToggleModalUpdate(true);
    };


    const onSubmitUpdate = () => {
        setIsStatusUpdated(!isStatusUpdated);
        setToggleModalUpdate(!toggleModalUpdate);
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}


            {toggleModalUpdate && departmentToEdit != null && (
                <ModalUpdate
                    title_modal={'Editar Departamento'}
                    labels={['Nombre']}
                    placeholders={['Ingrese nombre']}
                    methodGetOne={'POST'}
                    methodUpdateOne={'PATCH'}
                    fetchData={['name_department', 'status_department']}
                    getOneUrl={getSingleUrl}
                    idFetchData="id_department"
                    idToUpdate={departmentToEdit}
                    updateOneUrl={updateOneUrl}
                    onSubmitUpdate={onSubmitUpdate}
                    handleModalUpdate={handleModalUpdate}
                    fetchData_select={"status_department"}
                />
            )}

            {isModalAddOpen && (
                <ModalAdd
                    title_modal={'Nuevo Departamento'}
                    labels={['Nombre']}
                    placeholders={['Ingrese nombre']}
                    method={'POST'}
                    fetchData={['name_department']}
                    createOne={createDepartment}
                    handleDependencyAdd={handleOpenModalAdd}
                    handleModalAdd={handleOpenModalAdd}
                />
            )}

            <TableHorWithFilters
                addButtonTitle={handleOpenModalAdd}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENTS_INFO}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_department'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_department', order: 'ASC' }}
                actions={{
                    view: navigateDepartment,
                    edit: (row) => console.log("Editar", row),
                    delete: handleModalUpdate,
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: true
                }}
                actionColumn='id_department'
                title_table={"Gestion de Departamentos"}
                paginationLabelInfo={"Departamentos"}
                buttonOneInfo={{ img: SeeDepartment, color: "blue", title: "Ver Departamento" }}
                buttonTreeInfo={{ img: Edit, color: "black", title: "Editar Departamento" }}
                isStatusUpdated={isStatusUpdated}
            />


        </>

    );
}
export default LisDepartment;
