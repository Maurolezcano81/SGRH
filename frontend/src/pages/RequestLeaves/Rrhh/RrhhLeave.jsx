import { useEffect, useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";
import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import TableCapacitations from "./TableLeaves";
import SeeMore from "./SeeMore";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Trash from '../../../assets/Icons/Buttons/Trash.png'
import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../../contexts/BreadcrumbsContext";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";

const RrhhLeave = () => {

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
            { name: 'Solicitudes de Licencias', url: '/rrhh/solicitud/licencia' },
        ]);
    }, [location.pathname]);



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
        { value: 'e.name_entity', label: 'Nombre del solicitante' },
        { value: 'e.lastname_entity', label: 'Apellido del solicitante' },
        { value: 'eaut.name_entity', label: 'Nombre del Autor' },
        { value: 'eaut.lastname_entity', label: 'Apellido del Autor' },
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
        setIdToDelete(row.id_lrr)
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
                    title={"Solicitud de Licencia"}
                    titleButton={""}
                    onClick={''}
                />

                <TableCapacitations
                    dependencyToRefresh={isStatusUpdated}
                    setDependencyToRefresh={setIsStatusUpdated}
                />

                <ResponsiveTableNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LEAVE_RRHH}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'name_tol'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'answered_at', order: 'ASC' }}
                    actions={{
                        view: (row) => openSeeMore(row),
                        delete: (row) => handleModalDeleteOpen(row),
                    }}
                    showActions={{
                        view: true,
                        edit: true,
                        delete: true
                    }}
                    actionColumn='id_lrr'
                    paginationLabelInfo={'Solicitudes de Licencia'}
                    buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                    buttonTwoInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                    buttonTreeInfo={{ img: Trash, color: 'red', title: 'Eliminar Respuesta' }}
                    isStatusUpdated={isStatusUpdated}
                    titleInfo={[
                        { field: "author_profile", type: "field" },
                        { field: "author_name", type: "field" },
                        { field: "author_lastname", type: "field" },
                        { field: "aprobo", type: "string" },
                        { field: "name_tol", type: "field" },
                        { field: "de", type: "string" },
                        { field: "name_entity", type: "field" },
                        { field: "lastname_entity", type: "field" },
                        { field: "solicitada el", type: "string" },
                        { field: "date_requested", type: "field" },
                    ]}
                    headerInfo={
                        ["Solicitudes de Licencia Contestadas"]
                    }
                />



                {isModalDeleteOpen && (
                    <ModalDelete
                        handleModalDelete={handleModalDeleteClose}
                        deleteOne={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_LEAVE_ANSWER_RRHH}`}
                        field_name={'id_lrr'}
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

            </div>



        </>
    )
}


export default RrhhLeave;