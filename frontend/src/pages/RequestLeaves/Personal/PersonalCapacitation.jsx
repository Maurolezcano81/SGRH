import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";

import User from '../../../assets/Icons/Buttons/User.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'


const PersonalLeave = () => {

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


    const columns = [
        { field: 'name_tol', label: 'Titulo' },
        { field: 'reason_lr', label: 'Descripcion' },
        { field: 'created_at', label: 'Solicitado' },
        { field: 'name_sr', label: 'Estado de la solicitud' },
        { field: 'start_lr', label: 'Fecha de inicio' },
        { field: 'end_lr', label: 'Fecha de fin' },
        { field: 'answered_at', label: 'Respondido por' },
    ];

    const filterConfigs = [
        {
            key: 'name_sr',
            label: 'Estado de solicitud',
            name_field: 'name_sr',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST}`
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
            </div>

            <TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LEAVE_USER}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_tol'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_tol', order: 'ASC' }}
                actions={{
                    view: (row) => console.log('Editar', row),
                    edit: (row) => console.log('Editar', row),
                    delete: (row) => console.log('Editar', row),
                }}
                showActions={{
                    view: true,
                    edit: true,
                    delete: false
                }}
                actionColumn='id_lr'
                paginationLabelInfo={'Solicitudes de Licencia'}
                buttonOneInfo={{ img: User, color: 'blue', title: 'Ver Perfil' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
            />
        </>
    )
}


export default PersonalLeave;