import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

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


    const columns = [
        { field: 'name_ep', label: 'Cuestionario' },
        { field: 'start_ep', label: 'Fecha de Inicio' },
        { field: 'end_ep', label: 'Fecha de Fin' },
        { field: 'author', label: 'Autor' },
        { field: 'quantity_questions', label: 'Cantidad de Preguntas' },
    ];

    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_ep', label: 'Nombre del cuestionario' },
    ];


    const seeQuiz = (row) => {
        navigate("/supervisor/rendimiento/ampliar", { state: { value_quiz: row.id_ep } })
    };


    const addButtonTitle = () => {
        console.log('No disponible')
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <TableHorWithFilters
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_SUPERVISOR}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_sq'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_sq', order: 'ASC' }}
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
                actionColumn='id_sq'
                title_table={"Listado de cuestionarios"}
                paginationLabelInfo={"Cuestionarios de satisfaccion"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
            />


        </>

    );

}


export default HomeQuizPerformanceSupervisor;