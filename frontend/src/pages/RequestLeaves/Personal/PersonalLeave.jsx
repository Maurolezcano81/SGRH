import { useEffect, useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";

import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import SeeMore from "../Rrhh/SeeMore";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";
import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../../contexts/BreadcrumbsContext";


const PersonalLeave = () => {

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        updateBreadcrumbs([
            { name: 'Mis solicitudes de licencias', url: '/personal/solicitud/licencia' },
        ]);
    }, [location.pathname]);

    const [toggleFormRequest, setToggleFormRequest] = useState(false)
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const [initalData, setInitialData] = useState(null);
    const [isOpenSeeMore, setIsOpenSeeMore] = useState(false);

    const { authData } = useAuth();

    const handleOpenFormRequest = () => {
        setToggleFormRequest(true)
    }

    const handleStatusUpdated = () => {
        setIsStatusUpdated(!isStatusUpdated);
    }

    const handleCloseFormRequest = () => {
        setToggleFormRequest(!toggleFormRequest)
    }



    const openSeeMore = (initialData) => {
        setInitialData(initialData);
        setIsOpenSeeMore(true);
    }

    const closeSeeMore = () => {
        setIsOpenSeeMore(false);
    }


    const columns = [
        { field: 'name_tol', label: 'Tipo de Licencia' },
        { field: 'name_entity', label: 'Nombre del solicitante' },
        { field: 'lastname_entity', label: 'Apellido del solicitante' },
        { field: 'reason_lr', label: 'Descripcion' },
        { field: 'date_requested', label: 'Solicitado el' },
        { field: 'start_lr', label: 'Fecha de Inicio' },
        { field: 'end_lr', label: 'Fecha de Fin' },
        { field: 'author_name', label: 'Nombre del Autor' },
        { field: 'author_lastname', label: 'Apellido del Autor' },
        { field: 'answered_at', label: 'Respondido el' },
        { field: 'name_sr', label: 'Estado de la solicitud' }
    ];

    const filterConfigs = [
        {
            key: 'name_sr',
            label: 'Estado de solicitud',
            name_field: 'name_sr',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST_ACTIVES}`
        },
    ];

    const searchOptions = [
        { value: 'name_tol', label: 'Tipo de Licencia' },
        { value: 'reason_lr', label: 'Descripcion' },
        { value: 'eaut.name_entity', label: 'Nombre del Autor' },
        { value: 'eaut.lastname_entity', label: 'Apellido del Autor' },
    ];

    return (
        <>
            <div className="container__page">

                <PreferenceTitle
                    title={"Solicitud de Licencia"}
                    titleButton={"Solicitar Licencia"}
                    onClick={handleOpenFormRequest}
                />


                {toggleFormRequest && (
                    <FormRequest
                        handleCloseFormRequest={handleCloseFormRequest}
                        handleStatusUpdated={handleStatusUpdated}
                    />
                )}

                <ResponsiveTableNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LEAVE_USER}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'name_tol'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'date_requested', order: 'desc' }}
                    actions={{
                        view: (row) => openSeeMore(row),
                        edit: (row) => console.log('Editar', row),
                        delete: (row) => console.log('Editar', row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false
                    }}
                    actionColumn='id_lr'
                    paginationLabelInfo={'Solicitudes de Licencia'}
                    buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Perfil' }}
                    buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                    isStatusUpdated={isStatusUpdated}
                    titleInfo={[
                        { field: "Solicitud de", type: "string" },
                        { field: "name_tol", type: "field" },
                        { field: "solicitada el", type: "string" },
                        { field: "date_requested", type: "field" },
                    ]}
                    headerInfo={
                        ["Solicitudes de Licencia Contestadas"]
                    }
                />

                {isOpenSeeMore && (
                    <SeeMore
                        initialData={initalData}
                        closeModalAnswer={closeSeeMore}
                    />
                )}
            </div>


        </>
    )
}


export default PersonalLeave;