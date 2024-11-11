import { useEffect, useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";

import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";
import SeeMore from "../Rrhh/SeeMore";
import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../../contexts/BreadcrumbsContext";


const PersonalCapacitation = () => {

    const [toggleFormRequest, setToggleFormRequest] = useState(false)
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

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

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        updateBreadcrumbs([
            { name: 'Mis Solicitudes de Capacitación', url: '/personal/solicitud/capacitacion' },
        ]);
    }, [location.pathname]);



    const columns = [
        { field: 'title_rc', label: 'Asunto' },
        { field: 'description_rc', label: 'Descripcion' },
        { field: 'date_requested', label: 'Solicitado' },
        { field: 'name_sr', label: 'Estado de la solicitud' },
        { field: 'author_name', label: 'Nombre del respondedor' },
        { field: 'author_lastname', label: 'Apellido del respondedor' },
    ];

    const filterConfigs = [
        {
            key: 'name_sr',
            label: 'Estado de solicitud',
            name_field: 'name_sr',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST_ACTIVES}` // URL para obtener las opciones de ocupación 
        },
    ];

    const searchOptions = [
        { value: 'title_rc', label: 'Asunto' },
        { value: 'description_rc', label: 'Descripcion' },
        { value: 'date_requested', label: 'Solicitado' },
        { value: 'name_sr', label: 'Estado de la solicitud' },
    ];


    
    const openSeeMore = (initialData) => {
        setInitialData(initialData);
        setIsOpenSeeMore(true);
    }

    const closeSeeMore = () => {
        setIsOpenSeeMore(false);
    }

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [initalData, setInitialData] = useState(null);
    const [isOpenSeeMore, setIsOpenSeeMore] = useState(false);


    return (
        <>
            <div className="container__page">

                <PreferenceTitle
                    title={"Solicitud de Capacitacion"}
                    titleButton={"Solicitar Capacitación"}
                    onClick={handleOpenFormRequest}
                />


                {toggleFormRequest && (
                    <FormRequest
                        handleCloseFormRequest={handleCloseFormRequest}
                        handleStatusUpdated={handleStatusUpdated}
                    />
                )}

                <ResponsiveTableNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CAPACITATION_USER}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'title_rc'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'date_requested', order: 'DESC' }}
                    actions={{
                        view: (row) => openSeeMore(row),
                        delete: (row) => console.log(row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false
                    }}
                    actionColumn='id_rc'
                    paginationLabelInfo={'Solicitudes de capacitación'}
                    buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                    buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                    isStatusUpdated={isStatusUpdated}
                    titleInfo={[
                        { field: "title_rc", type: "field" },
                        { field: "solicitada el", type: "string" },
                        { field: "date_requested", type: "field" },
                        { field: "con estado", type: "string" },
                        { field: "-", type: "string" },
                        { field: "name_sr", type: "field" },
                    ]}
                    headerInfo={
                        ["Mis Solicitudes de Capacitaciones"]
                    }
                />
            </div>

            {isOpenSeeMore && (
                <SeeMore
                    initialData={initalData}
                    closeModalAnswer={closeSeeMore}
                />
            )}

        </>
    )
}


export default PersonalCapacitation;