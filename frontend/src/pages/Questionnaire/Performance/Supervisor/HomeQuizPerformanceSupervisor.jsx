import { useEffect, useState } from "react";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import Info from '../../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../../assets/Icons/Buttons/MoveEmployee.png'
import LastFive from "./LastFive";
import useAuth from "../../../../hooks/useAuth";
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";
import TableHorWithFilters from "../../../../components/Table/TableHorWithFilters";
import AlertSuccesfully from "../../../../components/Alerts/AlertSuccesfully";
import ErrorMessage from "../../../../components/Alerts/ErrorMessage";
import Quizz from '../../../../assets/Icons/Buttons/Quizz.png'
import { useLocation, useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "../../../../contexts/BreadcrumbsContext";
import ResponsiveTableNotTitleAndWhereOnUrl from "../../../../components/Table/ResponsiveTableNotTitleAndWhereOnUrl";

const HomeQuizPerformanceSupervisor = () => {

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { authData } = useAuth();
    const navigate = useNavigate();

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
            { name: 'Cuestionarios de Rendimiento', url: '/supervisor/rendimiento' },
        ]);
    }, [location.pathname]);


    const columns = [
        { field: 'name_ep', label: 'Nombre del Cuestionario' },
        { field: 'start_ep', label: 'Fecha de Inicio' },
        { field: 'end_ep', label: 'Fecha de Fin' },
        { field: 'name_entity', label: 'Nombre del Autor' },
        { field: 'lastname_entity', label: 'Apellido del Autor' },
        { field: 'quantity_questions', label: 'Cantidad de Preguntas' },
    ];

    const filterConfigs = [

    ];

    const searchOptions = [
        { field: 'name_ep', label: 'Nombre del Cuestionario' },
        { field: 'start_ep', label: 'Fecha de Inicio' },
        { field: 'end_ep', label: 'Fecha de Fin' },
        { field: 'name_entity', label: 'Nombre del Autor' },
        { field: 'lastname_entity', label: 'Apellido del Autor' },
    ];


    const seeQuiz = (row) => {
        navigate("/supervisor/rendimiento/ampliar", { state: { value_quiz: row.id_ep } })
    };


    const addButtonTitle = () => {
        console.log('No disponible')
    }

    return (
        <div className="container__page">

            <LastFive 
                isStatusUpdated={isStatusUpdated}
                setIsStatusUpdated={setIsStatusUpdated}
            />
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <ResponsiveTableNotTitleAndWhereOnUrl
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_SUPERVISOR}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_ep'}
                initialSearchTerm={''}
                initialSort={{ field: 'start_ep', order: 'desc' }}
                actions={{
                    view: seeQuiz,
                    edit: (row) => console.log("Editar", row),
                    delete: (row) => console.log("Editar", row)
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_ep'
                title_table={"Listado de cuestionarios"}
                paginationLabelInfo={"Cuestionarios de satisfaccion"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_ep", type: "field" },
                    { field: "-", type: "string" },
                    { field: "start_ep", type: "field" },
                ]}
                  headerInfo={
                    ["Cuestionarios y Fecha de Inicio"]
                  }
            />


        </div>

    );

}


export default HomeQuizPerformanceSupervisor;