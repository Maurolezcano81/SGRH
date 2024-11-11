import { useEffect, useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";
import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import TableCapacitations from "./TableCapacitations";
import SeeMore from "./SeeMore";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";
import Trash from '../../../assets/Icons/Buttons/Trash.png'
import ModalDelete from "../../../components/Modals/ModalDelete";
import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../../contexts/BreadcrumbsContext";


const RrhhCapacitation = () => {

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initalData, setInitialData] = useState(null);
    const [isOpenSeeMore, setIsOpenSeeMore] = useState(false);

    const { authData } = useAuth();

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
            { name: 'Solicitudes de Capacitación', url: '/rrhh/solicitud/capacitacion' },
        ]);
    }, [location.pathname]);


    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre del solicitante' },
        { field: 'lastname_entity', label: 'Apellido del solicitante' },
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
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST_ACTIVES}`
        },
    ];

    const searchOptions = [
        { value: 'title_rc', label: 'Asunto' },
        { value: 'e.name_entity', label: 'Nombre del solicitante' },
        { value: 'e.lastname_entity', label: 'Apellido del solicitante' },
        { value: 'description_rc', label: 'Descripcion' },
        { value: 'date_requested', label: 'Solicitado' },
        { value: 'name_sr', label: 'Estado de la solicitud' },
        { value: 'author_name', label: 'Nombre del respondedor' },
        { value: 'author_lastname', label: 'Apellido del respondedor' },
    ];


    const openSeeMore = (initialData) => {
        setInitialData(initialData);
        setIsOpenSeeMore(true);
    }

    const closeSeeMore = () => {
        setIsOpenSeeMore(false);
    }

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState("");

    const handleModalDeleteOpen = (row) => {
        setIdToDelete(row.id_rrc)
        setIsModalDeleteOpen(true);
    }

    const handleModalDeleteClose = () => {
        setIdToDelete("");
        setIsModalDeleteOpen(false);
        setIsStatusUpdated(!isStatusUpdated)
    }


    return (
        <>
            <div className="container__page">

                <PreferenceTitle
                    title={"Solicitud de Capacitacion"}
                    titleButton={""}
                    onClick={''}
                />

                <TableCapacitations
                    dependencyToRefresh={isStatusUpdated}
                    setDependencyToRefresh={setIsStatusUpdated}
                />


                <ResponsiveTableNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CAPACITATION_RRHH}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'date_requested'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'date_requested', order: 'DESC' }}
                    actions={{
                        view: (row) => openSeeMore(row),
                        delete: (row) => handleModalDeleteOpen(row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: true
                    }}
                    actionColumn='id_rc'
                    paginationLabelInfo={'Solicitudes de Capacitación'}
                    buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                    buttonTreeInfo={{ img: Trash, color: 'red', title: 'Eliminar Respuesta' }}
                    isStatusUpdated={isStatusUpdated}
                    titleInfo={[
                        { field: "author_profile", type: "field" },
                        { field: "author_name", type: "field" },
                        { field: "author_lastname", type: "field" },
                        { field: "respondio", type: "string" },
                        { field: "title_rc", type: "field" },
                        { field: "de", type: "string" },
                        { field: "name_entity", type: "field" },
                        { field: "lastname_entity", type: "field" },
                        { field: "solicitada el", type: "string" },
                        { field: "date_requested", type: "field" },
                    ]}
                    headerInfo={
                        ["Solicitudes de Capacitaciones Contestadas"]
                    }
                />
            </div>

            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_CAPACITATION_ANSWER_RRHH}`}
                    field_name={'id_rrc'}
                    idToDelete={idToDelete}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}


            {isOpenSeeMore && (
                <SeeMore
                    initialData={initalData}
                    closeModalAnswer={closeSeeMore}
                />
            )}

        </>
    )
}


export default RrhhCapacitation;