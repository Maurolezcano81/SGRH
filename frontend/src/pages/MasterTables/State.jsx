import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Edit from '../../assets/Icons/Buttons/Edit.png';
import Trash from '../../assets/Icons/Buttons/Trash.png';
import City from '../../assets/Icons/Buttons/City.png';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PreferenceTitle from '../MasterTables/PreferenceTitle.jsx';

import { useBreadcrumbs } from '../../contexts/BreadcrumbsContext';
import ResponsiveTableNotTitleAndWhereOnUrl from '../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl.jsx';
import ModalUpdate from '../../components/Modals/ModalUpdate.jsx';
import ModalDelete from '../../components/Modals/ModalDelete.jsx';
import ModalAddStateCity from '../../components/Address/ModalAddStateCity.jsx';



const State = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);


    const updateStatus = () => {
        setIsStatusUpdated(!isStatusUpdated);
    };
    const location = useLocation();

    const { id_state } = useParams();

    const { country } = location.state || {};

    const { authData } = useAuth();
    const { updateBreadcrumbs } = useBreadcrumbs();

    const [countryState, setCountryState] = useState(country);  // Usamos un estado local para country

    const navigate = useNavigate();

    useEffect(() => {
        if (country) {
            setCountryState((prevState) => ({
                ...prevState,
                id_country: id_state,  // Asigna id_state a country.id_country
            }));

            updateBreadcrumbs([
                { name: country.name_country, url: '/rrhh/ajustes/pais' },
                { name: 'Ver Provincias', url: '/rrhh/departamentos/ver' },
            ]);
        }
    }, [location.pathname, country, id_state]);  // Ejecuta el efecto cuando country o id_state cambian


    const columns = [
        { field: 'name_state', label: 'Nombre de la provincia' },
        { field: 'status_state', label: 'Estado' },
        { field: 'created_at', label: 'Creado el' },
        { field: 'updated_at', label: 'Actualizado el' },
    ];

    const filterConfigs = [
    ];

    const searchOptions = [
        { value: 'name_state', label: 'Nombre de la provincia' },
        { value: 'status_state', label: 'Estado' },
    ];


    const navigateToCity = (row) => {
        navigate('/rrhh/ajustes/ciudad', { state: { state: row } })
    };


    const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_STATE}`;
    const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_STATE}`;
    const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_STATE}`;
    const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_STATE}`;

    // MODAL ADD
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const handleModalAddOpen = () => {
        setIsModalAddOpen(true)
    }

    const handleModalAddClose = () => {
        setIsModalAddOpen(false)
    }

    // MODAL ADD

    // MODAL UPDATE

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [idToGet, setIdToGet] = useState("");

    const handleModalUpdateOpen = (row) => {
        setIdToGet(row.id_state)
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
        setIdToGet(row.id_state)
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
                titleButton={"Agregar Provincia"}
                onClick={() => handleModalAddOpen()}
            />

            <ResponsiveTableNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATES_ADMIN}/${country?.id_country}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_state'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_state', order: 'ASC' }}
                actions={{
                    view: (row) => handleModalUpdateOpen(row),
                    edit: (row) => handleModalDeleteOpen(row),
                    delete: (row) => navigateToCity(row),
                }}
                showActions={{
                    view: true,
                    edit: true,
                    delete: true
                }}
                actionColumn='id_state'
                paginationLabelInfo={'Ciudades'}
                buttonOneInfo={{ img: Edit, color: 'black', title: 'Editar' }}
                buttonTwoInfo={{ img: Trash, color: 'red', title: 'Eliminar' }}
                buttonTreeInfo={{ img: City, color: 'blue', title: 'Ver Ciudades' }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_state", type: "field" },
                ]}
                headerInfo={
                    ["Ciudades en la provincia"]
                }
            />

            {isModalUpdateOpen && (
                <ModalUpdate
                    title_modal={'Editar Provincia'}
                    labels={['Nombre']}
                    placeholders={['Ingrese nombre']}
                    methodGetOne={'POST'}
                    methodUpdateOne={'PATCH'}
                    fetchData={['name_state']}
                    getOneUrl={getSingleUrl}
                    idFetchData="value_state"
                    idToUpdate={idToGet}
                    updateOneUrl={updateOneUrl}
                    onSubmitUpdate={handleModalUpdateClose}
                    handleModalUpdate={handleModalUpdateClose}
                    fetchData_select={'status_state'}
                />
            )}

            {isModalAddOpen && (
                <ModalAddStateCity
                    title_modal={"Crear Provincia"}
                    createOne={createOne}
                    handleModalAdd={handleModalAddClose}
                    handleDependencyAdd={updateStatus}
                    idCountry={country?.id_country}
                />
            )}

            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={deleteOne}
                    field_name={'id_state'}
                    idToDelete={idToGet}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}

        </div>

    );
}
export default State;
