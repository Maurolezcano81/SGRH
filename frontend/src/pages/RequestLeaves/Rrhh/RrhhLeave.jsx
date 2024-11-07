import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";
import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import TableCapacitations from "./TableLeaves";
import SeeMore from "./SeeMore";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Trash from '../../../assets/Icons/Buttons/Trash.png'

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


    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'name_tol', label: 'Titulo' },
        { field: 'requestor_name', label: 'Nombre' },
        { field: 'reason_lr', label: 'Descripcion' },
        { field: 'start_lr', label: 'Fecha de Inicio' },
        { field: 'end_lr', label: 'Fecha de Fin' },
        { field: 'created_at', label: 'Solicitado' },
        { field: 'answered_by', label: 'Respondido por' },
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
        { value: 'name_tol', label: 'Titulo' },
        { value: 'reason_lr', label: 'Descripcion' },
        { value: 'requestor_name', label: 'Nombre y apellido del solicitante' },
        { value: 'requestor_name', label: 'Nombre y apellido del respondedor' }
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

                <TableSecondaryNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LEAVE_RRHH}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'name_tol'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_tol', order: 'ASC' }}
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