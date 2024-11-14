import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Edit from '../../assets/Icons/Buttons/Edit.png';
import Trash from '../../assets/Icons/Buttons/Trash.png';

import { useLocation, useNavigate } from 'react-router-dom';
import PreferenceTitle from '../MasterTables/PreferenceTitle.jsx';

import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import ResponsiveTableNotTitleAndWhereOnUrl from '../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl.jsx';
import ModalUpdate from '../../components/Modals/ModalUpdate.jsx';
import ModalDelete from '../../components/Modals/ModalDelete.jsx';
import ModalAddStateCity from '../../components/Address/ModalAddStateCity.jsx';
import ModalAddCity from '../../components/Address/ModalAddCity.jsx';



const City = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);


    const updateStatus = () => {
        setIsStatusUpdated(!isStatusUpdated);
    };

    const navigate = useNavigate();
    const location = useLocation();

    const { state } = location.state || {};

    const { authData } = useAuth();
    const { updateBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        if (state) {

            updateBreadcrumbs([
                { name: `${state.name_state}`, url: '/rrhh/ajustes/pais' },
                { name: `Ver Ciudades`, url: '/rrhh/departamentos/ver' },
            ]);
        }

    }, [location.pathname]);


    const columns = [
        { field: 'name_city', label: 'Nombre de la ciudad' },
        { field: 'status_city', label: 'Estado' },
        { field: 'created_at', label: 'Creado el' },
        { field: 'updated_at', label: 'Actualizado el' },
    ];

    const filterConfigs = [
    ];

    const searchOptions = [
        { value: 'name_city', label: 'Nombre de la ciudad' },
        { value: 'status_city', label: 'Estado' },
    ];


    const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_CITY}`;
    const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_CITY}`;
    const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_CITY}`;
    const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_CITY}`;

    // MODAL ADD
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const handleModalAddOpen = () => {
        setIsModalAddOpen(true)
    }

    const handleModalAddClose = () => {
        setIsModalAddOpen(false)
        updateStatus()
    }

    // MODAL ADD

    // MODAL UPDATE

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [idToGet, setIdToGet] = useState("");

    const handleModalUpdateOpen = (row) => {
        setIdToGet(row.id_city)
        setIsModalUpdateOpen(true)
    }

    const handleModalUpdateClose = () => {
        setIdToGet("")
        setIsModalUpdateOpen(false)
        updateStatus()
    }

    // MODAL UPDATE

    // MODAL DELETE

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);


    const handleModalDeleteOpen = (row) => {
        setIdToGet(row.id_city)
        setIsModalDeleteOpen(true)
    }

    const handleModalDeleteClose = () => {
        setIdToGet("")
        setIsModalDeleteOpen(false)
        updateStatus()
    }


    return (
        <div className='container__page'>
            <PreferenceTitle
                title={'Provincias'}
                titleButton={"Agregar Ciudad"}
                onClick={() => handleModalAddOpen()}
            />

            <ResponsiveTableNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CITIES_ADMIN}/${state?.id_state}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_city'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_city', order: 'ASC' }}
                actions={{
                    view: (row) => handleModalUpdateOpen(row),
                    edit: (row) => handleModalDeleteOpen(row),
                    delete: (row) => console.log(row),
                }}
                showActions={{
                    view: true,
                    edit: true,
                    delete: false
                }}
                actionColumn='id_city'
                paginationLabelInfo={'Ciudades'}
                buttonOneInfo={{ img: Edit, color: 'black', title: 'Editar' }}
                buttonTwoInfo={{ img: Trash, color: 'red', title: 'Eliminar' }}
                buttonTreeInfo={{ img: City, color: 'blue', title: 'Ver Ciudades' }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_city", type: "field" },
                ]}
                headerInfo={
                    ["Ciudades en la Ciudad"]
                }
            />

            {isModalUpdateOpen && (
                <ModalUpdate
                    title_modal={'Editar Ciudad'}
                    labels={['Nombre']}
                    placeholders={['Ingrese nombre']}
                    methodGetOne={'POST'}
                    methodUpdateOne={'PATCH'}
                    fetchData={['name_city']}
                    getOneUrl={getSingleUrl}
                    idFetchData="value_city"
                    idToUpdate={idToGet}
                    updateOneUrl={updateOneUrl}
                    onSubmitUpdate={handleModalUpdateClose}
                    handleModalUpdate={handleModalUpdateClose}
                    fetchData_select={'status_city'}
                />
            )}


            {isModalAddOpen && (
                <ModalAddCity
                    title_modal={"Crear Ciudad"}
                    createOne={createOne}
                    handleModalAdd={handleModalAddClose}
                    handleDependencyAdd={updateStatus}
                    idState={state?.id_state}
                />
            )}

            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={deleteOne}
                    field_name={'id_city'}
                    idToDelete={idToGet}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}

        </div>

    );
}
export default City;
