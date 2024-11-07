import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";
import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import TableCapacitations from "./TableCapacitations";
import SeeMore from "./SeeMore";


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


    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'requestor_name', label: 'Nombre' },
        { field: 'title_rc', label: 'Titulo' },
        { field: 'description_rc', label: 'Descripcion' },
        { field: 'created_at', label: 'Solicitado' },
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
        { value: 'title_rc', label: 'Titulo' },
        { value: 'description_rc', label: 'Descripcion' },
    ];


    const openSeeMore = (initialData) => {
        setInitialData(initialData);
        setIsOpenSeeMore(true);
    }

    const closeSeeMore = () => {
        setIsOpenSeeMore(false);
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


                <TableSecondaryNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CAPACITATION_RRHH}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'title_rc'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'title_rc', order: 'ASC' }}
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
                    actionColumn='id_rc'
                    paginationLabelInfo={'Solicitudes de capacitación'}
                    buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                    buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                    isStatusUpdated={isStatusUpdated}
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


export default RrhhCapacitation;