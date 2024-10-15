import { useState, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import SeeProfile from '../../../../assets/Icons/Buttons/Quizz.png'
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";

const SingleQuizPerformanceSupervisor = () => {

    const { value_quiz } = location.state || '';
    const {authData} = useAuth();

    const columns = [
        { field: 'name_ep', label: '' },
        { field: 'average', label: 'Puntuación Promedio' },
        { field: 'date_complete', label: 'Fecha de Finalización' },
        { field: 'supervisor_name', label: 'Nombre del Supervisor' },
        { field: 'supervisor_lastname', label: 'Apellido del Supervisor' },
    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'esupervisor.name_entity', label: 'Nombre del Supervisor' },
        { value: 'esupervisor.lastname_entity', label: 'Apellido del Supervisor' },
        { value: 'name_ep', label: 'Nombre de cuestionario' },

    ];

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initialDataForSeeInfo, setInitialDataForSeeInfo] = useState([]);
    const [isModalSeeInfoOpen, setIsModalSeeInfoOpen] = useState(false);


    const handleIsModalSeeInfoOpen = (row) => {
        setInitialDataForSeeInfo(row)
        setIsModalSeeInfoOpen(true)
    }

    const handleCloseIsModalSeeInfoOpen = () => {
        setIsModalSeeInfoOpen(false);
    }


    return (
        <div className="container__page">
<div className="container__content">
                <PreferenceTitle
                    title={"Respuestas"}
                />

                <TableSecondaryNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_ANSWERED_PERSONAL}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'name_ep'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_ep', order: 'ASC' }}
                    actions={{
                        view: (row) => handleIsModalSeeInfoOpen(row),
                        edit: () => console.log('asd'),
                        delete:() => console.log('asd'),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: true
                    }}
                    actionColumn='id_ap'
                    paginationLabelInfo={'Cuestionarios Desarrollados'}
                    buttonOneInfo={{ img: SeeProfile, color: 'blue', title: 'Ver' }}
                    isStatusUpdated={isStatusUpdated}
                />

                {isModalSeeInfoOpen && (
                    <ModalInfoQuizAnswered
                        initialData={initialDataForSeeInfo}
                        closeModalAnswer={handleCloseIsModalSeeInfoOpen}
                    />
                )}
            </div>
        </div>
            

    )
}

export default SingleQuizPerformanceSupervisor