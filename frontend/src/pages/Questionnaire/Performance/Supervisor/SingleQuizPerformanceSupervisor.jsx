import { useState, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import SeeProfile from '../../../../assets/Icons/Buttons/Quizz.png'
import ModalInfoQuizAnswered from "../ModalInfoQuizAnswered";

const SingleQuizPerformanceSupervisor = () => {

    const [messageDataQuiz, setMessageDataQuiz] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [isAddedQuestion, setIsAddedQuestion] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();
    const { authData } = useAuth();

    const { value_quiz } = location.state || '';


    const getHeaderQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_HEADER}/${value_quiz}`

    const urlToGetQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_PERFORMANCE_SUPERVISOR_QUESTIONS}/${value_quiz}`


    useEffect(() => {
        if (value_quiz) {

            const fetchQuizData = async () => {

                const response = await fetch(urlToGetQuiz, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    }
                })

                const data = await response.json();

                if (response.status === 403) {
                    setMessageDataQuiz(data.message);
                }

                setQuizData(data.queryResponse);
            }

            const fetchTitleQuiz = async () => {

                const response = await fetch(getHeaderQuiz, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    }
                })

                const data = await response.json();

                if (response.status === 403) {
                    setMessageDataQuiz(data.message);
                }

                setHeaderData(data.queryResponse);
            }

            fetchTitleQuiz();
            fetchQuizData();
        }

    }, [value_quiz, authData.token])


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
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}` // URL para obtener las opciones de ocupación 
        },
    ];

    const searchOptions = [
        { value: 'evaluated.name_entity', label: 'Nombre del Evaluado' },
        { value: 'evaluated.entity_lastname', label: 'Apellido del Evaluado' },
        { value: 'esupervisor.name_entity', label: 'Nombre del Supervisor' },
        { value: 'esupervisor.lastname_entity', label: 'Apellido del Supervisor' },
        { value: 'name_ep', label: 'Nombre de cuestionario' },

    ];

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initialDataForSeeInfo, setInitialDataForSeeInfo] = useState([]);
    const [isModalSeeInfoOpen, setIsModalSeeInfoOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [idQuizAnsweredToDelete, setIdQuizAnsweredToDelete] = useState("")

    const urlDeleteQuizAnswered = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_QUIZ_ANSWERED}`

    const handleIsModalSeeInfoOpen = (row) => {
        setInitialDataForSeeInfo(row)
        setIsModalSeeInfoOpen(true)
    }

    const handleCloseIsModalSeeInfoOpen = () => {
        setIsModalSeeInfoOpen(false);
    }

    const handleIsModalDeleteOpen = (row) => {
        setIdQuizAnsweredToDelete(row.id_ap)
        setIsModalDeleteOpen(true)
    }

    const handleCloseIsModalDeleteClose = () => {
        setIsModalDeleteOpen(false)
        setIsStatusUpdated(!isStatusUpdated)
    }

    return (
        <div className="container__page">
            <div className="container__content quiz">

                <div className="quiz__header__container">
                    <div className="quiz__header__section">
                        <div className="question__title">
                            <h1 className="quiz__label quiz__title">{headerData.name_ep}</h1>
                        </div>

                    </div>

                    <div className="quiz__header__section">
                        <h4 className="margin-y-1">Información del cuestionario</h4>
                        <div className="quiz__header__dates">
                            <div className="quiz__header__date">
                                <h4>Fecha de inicio:</h4>
                                <p className="quiz__input">{headerData.start_ep}</p>
                            </div>

                            <div className="quiz__header__date">
                                <h4>Fecha de finalización:</h4>
                                <h4 className="quiz__input">{headerData.end_ep}</h4>
                            </div>

                            <div className="quiz__header__date">
                                <h4>Autor:</h4>
                                <h4 className="quiz__input">{headerData.author}</h4>
                            </div>

                            <div className="quiz__header__date">
                                <h4>Cantidad de preguntas:</h4>
                                <h4 className="quiz__input">{headerData.quantity_questions}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quiz__header__section">
                    <h4 className="margin-y-1">Cuerpo del Cuestionario</h4>


                    <div className="quiz__body__question__container">
                        {quizData.map((question, index) => (
                            <div className="quiz__body__question__container">

                                <div className="question__title">
                                    <p>Pregunta {index + 1}</p>
                                </div>
                                <div className="question__title">
                                    <h2>{question.description_epq}</h2>
                                </div>
                                <div className="question__information">
                                    <p>Descripción obligatoria: <span>
                                        {question && question.is_obligatory === 1 ? "Si" : "No"}
                                    </span></p>
                                    <p>Parametro minimo: <span>{question.bad_parameter_epq}</span></p>
                                    <p>Parametro maximo: <span>{question.best_parameter_epq}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>


            <div className="container__content">
                <PreferenceTitle
                    title={"Respuestas"}
                />

                <TableSecondaryNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_ANSWERED_SUPERVISOR_AND_BY_ID_QUIZ}/${value_quiz}`}
                    authToken={authData.token}
                    columns={columns}
                    filterConfigs={filterConfigs}
                    searchOptions={searchOptions}
                    initialSearchField={'evaluated.name_entity'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'evaluated.name_entity', order: 'ASC' }}
                    actions={{
                        view: (row) => handleIsModalSeeInfoOpen(row),
                        edit: () => console.log('asd'),
                        delete: (row) => handleIsModalDeleteOpen(row),
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