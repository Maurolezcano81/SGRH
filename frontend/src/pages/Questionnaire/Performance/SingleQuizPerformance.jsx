import { useState, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import ModalAdd from '../../../components/Modals/ModalAdd';
import ModalDelete from "../../../components/Modals/ModalDelete";
import Trash from "../../../assets/Icons/Preferences/Trash.png";
import Edit from "../../../assets/Icons/Preferences/Edit.png";
import ButtonWhiteOutlineBlack from "../../../components/Buttons/ButtonWhiteOutlineBlack";
import ModalUpdate from "../../../components/Modals/ModalUpdate";
import ModalUpdateQuiz from "./Components/ModalUpdateSQ";
import ButtonImgTxt from "../../../components/ButtonImgTex";
import ModalTableWFilters from "../../../components/Modals/Updates/ModalTableWFilters";
import AddEmployee from '../../../assets/Icons/Buttons/AddEmployee.png'
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import SeeProfile from '../../../assets/Icons/Buttons/Quizz.png'
import ModalInfoQuizAnswered from "./ModalInfoQuizAnswered";

const SingleQuizPerformance = () => {

    const [messageDataQuiz, setMessageDataQuiz] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [isAddedQuestion, setIsAddedQuestion] = useState(false);
    const [isStatusUpdate, setIsStatusUpdate] = useState(false);



    const location = useLocation();
    const navigate = useNavigate();
    const { authData } = useAuth();

    const { value_quiz } = location.state || '';


    const getHeaderQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_HEADER}/${value_quiz}`
    const updateHeaderQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_QUIZ_PERFORMANCE_HEADER}`
    const deleteAllQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ALL_QUIZ_PERFORMANCE}`

    const urlToGetQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_PERFORMANCE}/${value_quiz}`

    const createQuestion = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ONE_QUESTION_PERFORMANCE_ADD}/${value_quiz}`

    const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ONE_QUIZ_PERFORMANCE_EDIT}`

    const deleteQuestion = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ONE_QUIZ_QUESTION_PERFORMANCE}`

    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);


    const [showModalHeaderUpdate, setShowModalHeaderUpdate] = useState(false);
    const [showModalHeaderDelete, setShowModalHeaderDelete] = useState(false);


    const [currentQuestion, setCurrentQuestion] = useState(null);

    const handleOpenUpdateHeader = () => {
        setShowModalHeaderUpdate(!showModalHeaderUpdate);
    }

    const handleModalUpdateHeader = () => {
        setShowModalUpdate(false);
        setIsAddedQuestion(!isAddedQuestion);
    }

    const handleOpenDeleteHeader = () => {
        setShowModalHeaderDelete(!showModalHeaderDelete);
        setTimeout(() => {
            navigate('/rrhh/rendimiento/cuestionarios')
        }, 3000)
    }

    const handleModalDeleteHeader = () => {
        setShowModalDelete(!showModalHeaderDelete)
        setTimeout(() => {
            navigate('/rrhh/rendimiento/cuestionarios')
        }, 3000)
    }

    const handleOpenUpdate = (question) => {
        setCurrentQuestion(question)
        setShowModalUpdate(true);
    };

    const handleOpenDelete = (question) => {
        setCurrentQuestion(question);
        setShowModalDelete(true);
    };

    const handleOpenAdd = () => {
        setShowModalAdd(!showModalAdd);
    };

    const handleModalUpdate = () => {
        setShowModalUpdate(!showModalUpdate);
        setIsAddedQuestion(!isAddedQuestion);
    }

    const handleModalDelete = () => {
        setShowModalDelete(!isAddedQuestion);
        setIsAddedQuestion(!isAddedQuestion);
    }

    const handleDependencyAdd = () => {
        setIsAddedQuestion(!isAddedQuestion);
    };



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

            const checkExcludeSupervisors = () => {
                const newArray = headerData.supervisors?.map((supervisor) => supervisor.id_user);

                setArrayToExclude(newArray);
            };

            fetchTitleQuiz();
            fetchQuizData();
            checkExcludeSupervisors()
        }

    }, [value_quiz, authData.token, isAddedQuestion, headerData?.supervisors])

    const columsToModal = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_department', label: 'Departamento' },
        { field: 'name_occupation', label: 'Puesto de Trabajo' },
    ]


    const filtersToModal = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}`
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT}`
        },
    ];

    const searchOptionsToModal = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },

    ]


    const [isAddSupervisorModalOpen, setIsAddSupervisorModalOpen] = useState(false);
    const [arrayToExclude, setArrayToExclude] = useState([]);

    const getNotSupervisorUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_NOT_SUPERVISOR}`

    const handleOpenModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(true)
    }

    const handleCloseModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(false)
    }

    const addSupervisorUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ONE_QUIZ_PERFORMANCE_SUPERVISOR}`
    const deleteSupervisorUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_QUIZ_PERFORMANCE_SUPERVISOR}`

    const addSupervisor = async (row) => {
        try {

            const response = await fetch(addSupervisorUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    id_ep: value_quiz,
                    id_user: row.id_user
                })
            })

            setIsAddedQuestion(!isAddedQuestion);
            setIsStatusUpdate(!isStatusUpdate);
            handleCloseModalAddSupervisor()
        } catch (error) {
            console.log(error);
        }
    };


    const deleteSupervisor = async (row) => {
        try {

            const response = await fetch(deleteSupervisorUrl, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    id_spq: row.id_spq
                })
            })

            setIsAddedQuestion(!isAddedQuestion);
            setIsStatusUpdate(!isStatusUpdate);
        } catch (error) {
            console.log(error);
        }
    };

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
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT}` // URL para obtener las opciones de departamento
        }
    ];

    const searchOptions = [
        { value: 'evaluated.name_entity', label: 'Nombre del Evaluado' },
        { value: 'evaluated.entity_lastname', label: 'Apellido del Evaluado' },
        { value: 'esupervisor.name_entity', label: 'Nombre del Supervisor' },
        { value: 'esupervisor.lastname_entity', label: 'Apellido del Supervisor' },
    ];

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initialDataForSeeInfo, setInitialDataForSeeInfo] = useState({});
    const [isModalSeeInfoOpen, setIsModalSeeInfoOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [idQuizAnsweredToDelete, setIdQuizAnsweredToDelete] = useState("")

    const urlDeleteQuizAnswered = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_QUIZ_PERFORMANCE_ANSWERED}`

    const handleIsModalSeeInfoOpen = (row) => {
        if (row.id_ap !== initialDataForSeeInfo.id_ap) {
            setInitialDataForSeeInfo(row);
            setIsModalSeeInfoOpen(true);
        }
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

                            {headerData && headerData.canEdit && (

                                <div className="quiz__buttons__container">
                                    <button className="preference__edit" onClick={() => handleOpenUpdateHeader(headerData)}>
                                        <img src={Edit} alt="Edit" />
                                    </button>
                                    <button className="preference__delete" onClick={() => handleOpenDeleteHeader(value_quiz)}>
                                        <img src={Trash} alt="Delete" />
                                    </button>
                                </div>
                            )}
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
                                <h4 className="quiz__input">Fecha Fin</h4>
                            </div>

                            <div className="quiz__header__date">
                                <h4>Cantidad de respuestas:</h4>
                                <h4 className="quiz__input">3</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quiz__header__container">
                    <div className="container__content">

                        <h4>Selección de supervisores</h4>
                        <div className="quiz__supervisors__container">

                            {headerData.supervisors && headerData.supervisors.length > 0 && headerData.supervisors.map((supervisor) => (
                                <div className="quiz__supervisor__container" key={supervisor.id_user}>
                                    <div className="not__answer__header__profile">
                                        <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${supervisor.avatar_user}`} alt="" />
                                    </div>

                                    <div>
                                        <h4>{`${supervisor.name_entity} ${supervisor.lastname_entity}`}</h4>
                                        <p className="info__message">{supervisor.name_department}</p>
                                    </div>

                                    <div>
                                        <ButtonImgTxt
                                            img={Trash}
                                            title={"Quitar"}
                                            color={"red"}
                                            onClick={() => deleteSupervisor(supervisor)}
                                        />
                                    </div>
                                </div>
                            ))}



                            <ButtonWhiteOutlineBlack
                                title={"+ Agregar Supervisor"}
                                onClick={handleOpenModalAddSupervisor}
                            />

                        </div>

                    </div>

                    {isAddSupervisorModalOpen && (
                        <ModalTableWFilters
                            url={getNotSupervisorUrl}
                            authToken={authData.token}
                            columns={columsToModal}
                            filterConfigs={filtersToModal}
                            searchOptions={searchOptionsToModal}
                            initialSearchField={'name_entity'}
                            initialSearchTerm={''}
                            initialSort={{ field: 'name_entity', order: 'ASC' }}
                            actions={{
                                view: (row) => addSupervisor(row),
                                edit: (row) => console.log('Editar', row),
                                delete: (row) => console.log('Editar', row),
                            }}
                            showActions={{
                                view: true,
                                edit: false,
                                delete: false
                            }}
                            actionColumn='id_entity'
                            paginationLabelInfo={'Personas'}
                            buttonOneInfo={{ img: AddEmployee, color: 'blue', title: 'Agregar Personal' }}
                            isStatusUpdated={setIsStatusUpdate}
                            handleCloseModal={handleCloseModalAddSupervisor}
                            title_table={"Lista de Personas"}
                            colorTable={'bg__green-5'}
                            arrayToExclude={arrayToExclude}
                        />
                    )}

                </div>

                <div className="quiz__header__section">
                    <h4 className="margin-y-1">Cuerpo del Cuestionario</h4>


                    <div className="quiz__body__question__container">
                        {quizData.map((question, index) => (
                            <div className="quiz__body__question__container">

                                <div className="question__title">
                                    <p>Pregunta {index + 1}</p>
                                    {headerData && headerData.canEdit && (

                                        <div key={question.id_epq} className="quiz__buttons__container">
                                            <button className="preference__edit" onClick={() => handleOpenUpdate(question)}>
                                                <img src={Edit} alt="Edit" />
                                            </button>
                                            <button className="preference__delete" onClick={() => handleOpenDelete(question)}>
                                                <img src={Trash} alt="Delete" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="question__title">
                                    <h2>{question.question_epq}</h2>
                                </div>
                                <div className="question__information">
                                    <p>Descripcion: <span>{question.description_epq}</span></p>
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

                <ButtonWhiteOutlineBlack
                    title={"+ Agregar Pregunta"}
                    onClick={handleOpenAdd}
                    full={true}
                />
            </div>

            {showModalAdd && (
                <ModalAdd
                    title_modal={'Nuevo Pregunta'}
                    labels={['Titulo de pregunta', 'Descripcion de pregunta', 'Es obligatorio', 'Texto parametro minimo', 'Texto parametro maximo']}
                    placeholders={['Ingrese la pregunta', 'Ingrese una descripcion para la pregunta', 'Ingrese un texto de valor minimo', 'Ingrese un texto de valor maximo']}
                    method={'POST'}
                    fetchData={['question_epq', 'description_epq', 'is_obligatory', 'bad_parameter_epq', 'best_parameter_epq']}
                    createOne={createQuestion}
                    handleDependencyAdd={handleDependencyAdd}
                    handleModalAdd={handleOpenAdd}
                />
            )}

            {showModalUpdate && (
                <ModalUpdateQuiz
                    title_modal={'Editar Pregunta'}
                    labels={['Titulo de pregunta', 'Descripcion de pregunta', 'Ingrese si la pregunta es obligatoria', "Texto parametro minimo", "texto parametro maximo"]}
                    placeholders={['Ingrese la pregunta', 'Descripcion de pregunta', 'Ingrese si la pregunta es obligatoria', 'Ingrese un texto de valor minimo', 'Ingrese un texto de valor maximo']}
                    methodGetOne={'POST'}
                    methodUpdateOne={'PATCH'}
                    fetchData={['question_epq', 'description_epq', 'is_obligatory', 'bad_parameter_epq', 'best_parameter_epq']}
                    idFetchData="is_obligatory"
                    dataQuestion={currentQuestion}
                    updateOneUrl={updateOneUrl}
                    onSubmitUpdate={handleOpenUpdate}
                    handleModalUpdate={handleModalUpdate}
                />
            )}


            {showModalDelete && (
                <ModalDelete
                    handleModalDelete={handleModalDelete}
                    deleteOne={deleteQuestion}
                    field_name={'id_epq'}
                    idToDelete={currentQuestion.id_epq}
                    onSubmitDelete={handleModalDelete}
                />
            )}

            {showModalHeaderDelete && (
                <ModalDelete
                    handleModalDelete={handleOpenDeleteHeader}
                    deleteOne={deleteAllQuiz}
                    field_name={'id_ep'}
                    idToDelete={value_quiz}
                    onSubmitDelete={handleModalDeleteHeader}
                />
            )}

            {showModalHeaderUpdate && (
                <ModalUpdateQuiz
                    title_modal={'Editar Cabecera del Cuestionario'}
                    labels={['Titulo del cuestionario', 'Ingrese fecha de inicio', "Ingrese fecha de finalizacion"]}
                    placeholders={['Ingrese el nuevo titulo', 'Ingrese una nueva fecha de inicio', 'Ingrese una fecha de finalizacion']}
                    methodUpdateOne={'PATCH'}
                    fetchData={['name_ep', 'start_ep', 'end_ep']}
                    dataQuestion={headerData}
                    updateOneUrl={updateHeaderQuiz}
                    onSubmitUpdate={handleModalUpdateHeader}
                    handleModalUpdate={handleOpenUpdateHeader}
                />
            )}

            <div className="container__content">
                <PreferenceTitle
                    title={"Respuestas"}
                />

                <TableSecondaryNotTitleAndWhereOnUrl
                    url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_ANSWERED_FOR_RRHH}/${value_quiz}`}
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
                    buttonTreeInfo={{ img: Trash, color: 'red', title: 'Eliminar' }}
                    isStatusUpdated={isStatusUpdate}
                />

                {isModalSeeInfoOpen && (
                    <ModalInfoQuizAnswered
                        initialData={initialDataForSeeInfo}
                        closeModalAnswer={handleCloseIsModalSeeInfoOpen}
                    />
                )}

                {isModalDeleteOpen && (
                    <ModalDelete
                        handleModalDelete={handleCloseIsModalDeleteClose}
                        deleteOne={urlDeleteQuizAnswered}
                        field_name={"id_ap"}
                        idToDelete={idQuizAnsweredToDelete}
                        onSubmitDelete={handleCloseIsModalDeleteClose}
                    />
                )}
            </div>

        </div>

    )
}

export default SingleQuizPerformance