import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";

import Info from '../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'
import SeeMore from "../Rrhh/SeeMore";


const PersonalLeave = () => {

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
        { field: 'name_tol', label: 'Titulo' },
        { field: 'reason_lr', label: 'Descripcion' },
        { field: 'created_at', label: 'Solicitado' },
        { field: 'name_sr', label: 'Estado de la solicitud' },
        { field: 'start_lr', label: 'Fecha de inicio' },
        { field: 'end_lr', label: 'Fecha de fin' },
        { field: 'answered_by', label: 'Respondido por' },
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

<TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LEAVE_USER}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_tol'}
                initialSearchTerm={''}
                initialSort={{ field: 'created_at', order: 'desc' }}
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