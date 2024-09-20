import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import useAuth from "../../../hooks/useAuth";

import User from '../../../assets/Icons/Buttons/User.png'
import MoveEmployee from '../../../assets/Icons/Buttons/MoveEmployee.png'


const PersonalCapacitation = () => {

    const [toggleFormRequest, setToggleFormRequest] = useState(false)
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();

    const handleOpenFormRequest = () => {
        setToggleFormRequest(true)
    }

    const handleStatusUpdated = () =>{
        setIsStatusUpdated(!isStatusUpdated);
    }

    const handleCloseFormRequest = () => {
        setToggleFormRequest(!toggleFormRequest)
    }


    const columns = [
        { field: 'title_rc', label: 'Titulo' },
        { field: 'description_rc', label: 'Descripcion' },
        { field: 'created_at', label: 'Solicitado' },
        { field: 'updated_at', label: 'Ultima actualización' },
        { field: 'name_sr', label: 'Estado de la solicitud' }
    ];

    const filterConfigs = [
        {
            key: 'name_sr',
            label: 'Estado de solicitud',
            name_field: 'name_sr',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST}` // URL para obtener las opciones de ocupación 
        },
    ];

    const searchOptions = [
        { value: 'title_rc', label: 'Titulo' },
        { value: 'description_rc', label: 'Descripcion' },
    ];

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

<TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CAPACITATION_USER}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'title_rc'}
                initialSearchTerm={''}
                initialSort={{ field: 'title_rc', order: 'ASC' }}
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
                actionColumn='id_rc'
                paginationLabelInfo={'Solicitudes de capacitación'}
                buttonOneInfo={{ img: User, color: 'blue', title: 'Ver Perfil' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
            />
            </div>


        </>
    )
}


export default PersonalCapacitation;