import { useState, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import SeeProfile from '../../../../assets/Icons/Buttons/Quizz.png'
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";
import { useBreadcrumbs } from "../../../../contexts/BreadcrumbsContext";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";

const SingleQuizPerformanceSupervisor = () => {

    const { authData } = useAuth();

    const location = useLocation();
    const { value_quiz } = location.state || '';

    const { updateBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        updateBreadcrumbs([
            { name: 'Mis Cuestionarios de Satisfacción', url: '/personal/rendimiento/ver' },
        ]);
    }, [location.pathname]);



    const columns = [
        { field: 'avatar_user', label: '' },
        { field: 'evaluated_name', label: 'Nombre del Evaluado' },
        { field: 'evaluated_lastname', label: 'Apellido del Evaluado' },
        { field: 'average', label: 'Puntuación Promedio' },
        { field: 'date_complete', label: 'Fecha de Finalización' },
        { field: 'supervisor_name', label: 'Nombre del Supervisor' },
        { field: 'supervisor_lastname', label: 'Apellido del Supervisor' },
        { field: 'name_department', label: 'Departamento' },
        { field: 'name_occupation', label: 'Puesto de Trabajo' },

    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'supervisor_name', label: 'Nombre del Supervisor' },
        { value: 'supervisor_lastname', label: 'Apellido del Supervisor' },
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

                <ResponsiveTableNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_ANSWERED_PERSONAL}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'name_ep'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'ap2.date_complete', order: 'desc' }}
                    actions={{
                        view: (row) => handleIsModalSeeInfoOpen(row),
                        edit: () => console.log('asd'),
                        delete: () => console.log('asd'),
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
                    titleInfo={[
                        { field: "supervisor_name", type: "field" },
                        { field: "supervisor_lastname", type: "field" },
                        { field: "Te evalúo con -", type: "string" },
                        { field: "average", type: "field" },
                    ]}
                    headerInfo={
                        ["Evalúaciones"]
                    }
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