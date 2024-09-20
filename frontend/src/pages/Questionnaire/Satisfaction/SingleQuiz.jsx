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


const SingleQuiz = () => {

    const [messageDataQuiz, setMessageDataQuiz] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [isAddedQuestion, setIsAddedQuestion] = useState(false);




    const location = useLocation();
    const navigate = useNavigate();
    const { authData } = useAuth();

    const { value_quiz } = location.state || '';


    const getHeaderQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTION_HEADER}/${value_quiz}`
    const updateHeaderQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_QUIZ_SATISFACTION_HEADER}`
    const deleteAllQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ALL_QUIZ}`

    const urlToGetQuiz = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_SATISFACTION}/${value_quiz}`

    const createQuestion = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ONE_QUESTION_SATISFACTION_ADD}/${value_quiz}`

    const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ONE_QUIZ_SATISFACTION_EDIT}`

    const deleteQuestion = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ONE_QUIZ_QUESTION}`

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
            navigate('/rrhh/satisfaccion/cuestionarios')

        }, 1000)
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

            fetchTitleQuiz();
            fetchQuizData();
        }

    }, [value_quiz, authData.token, isAddedQuestion])

    console.log(headerData)

    return (
        <div className="container__page">
            <div className="container__content quiz">

                <div className="quiz__header__container">
                    <div className="quiz__header__section">
                        <div className="question__title">
                            <h1 className="quiz__label quiz__title">{headerData.name_sq}</h1>
                            <div className="quiz__buttons__container">
                                <button className="preference__edit" onClick={() => handleOpenUpdateHeader(headerData)}>
                                    <img src={Edit} alt="Edit" />
                                </button>
                                <button className="preference__delete" onClick={() => handleOpenDeleteHeader(value_quiz)}>
                                    <img src={Trash} alt="Delete" />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="quiz__header__section">
                        <h4>Información del cuestionario</h4>
                        <div className="quiz__header__dates">
                            <div className="quiz__header__date">
                                <h4>Fecha de inicio:</h4>
                                <p className="quiz__input">{headerData.start_sq}</p>
                            </div>

                            <div className="quiz__header__date">
                                <h4>Fecha de finalización:</h4>
                                <h4 className="quiz__input">{headerData.end_sq}</h4>
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

                <div className="quiz__header__section">
                    <h4>Cuerpo del Cuestionario</h4>


                    <div className="quiz__body__question__container">
                        {quizData.map((question, index) => (
                            <div className="quiz__body__question__container">

                                <div className="question__title">
                                    <p>Pregunta {index + 1}</p>
                                    <div key={question.id_qsq} className="quiz__buttons__container">
                                        <button className="preference__edit" onClick={() => handleOpenUpdate(question)}>
                                            <img src={Edit} alt="Edit" />
                                        </button>
                                        <button className="preference__delete" onClick={() => handleOpenDelete(question)}>
                                            <img src={Trash} alt="Delete" />
                                        </button>
                                    </div>
                                </div>
                                <div className="question__title">
                                    <h2>{question.description_qsq}</h2>
                                </div>
                                <div className="question__information">
                                    <p>Es obligatorio: <span>
                                        {question && question.is_obligatory === 1 ? "Si" : "No"}
                                    </span></p>
                                    <p>Parametro minimo: <span>{question.bad_parameter_qsq}</span></p>
                                    <p>Parametro maximo: <span>{question.best_parameter_qsq}</span></p>
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
                    labels={['Titulo de pregunta', 'Es obligatorio', 'Texto parametro minimo', 'Texto parametro maximo']}
                    placeholders={['Ingrese la pregunta', '', 'Ingrese un texto de valor minimo', 'Ingrese un texto de valor maximo']}
                    method={'POST'}
                    fetchData={['description_qsq', 'is_obligatory', 'bad_parameter_qsq', 'best_parameter_qsq']}
                    createOne={createQuestion}
                    handleDependencyAdd={handleDependencyAdd}
                    handleModalAdd={handleOpenAdd}
                />
            )}

            {showModalUpdate && (
                <ModalUpdateQuiz
                    title_modal={'Editar Pregunta'}
                    labels={['Titulo de pregunta', 'Ingrese si la pregunta es obligatoria', "Texto parametro minimo", "texto parametro maximo"]}
                    placeholders={['Ingrese la pregunta', 'Ingrese si la pregunta es obligatoria', 'Ingrese un texto de valor minimo', 'Ingrese un texto de valor maximo']}
                    methodGetOne={'POST'}
                    methodUpdateOne={'PATCH'}
                    fetchData={['description_qsq', 'is_obligatory', 'bad_parameter_qsq', 'best_parameter_qsq']}
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
                    field_name={'id_qsq'}
                    idToDelete={currentQuestion.id_qsq}
                    onSubmitDelete={handleModalDelete}
                />
            )}

            {showModalHeaderDelete && (
                <ModalDelete
                    handleModalDelete={handleOpenDeleteHeader}
                    deleteOne={deleteAllQuiz}
                    field_name={'id_sq'}
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
                    fetchData={['name_sq', 'start_sq', 'end_sq']}
                    dataQuestion={headerData}
                    updateOneUrl={updateHeaderQuiz}
                    onSubmitUpdate={handleModalUpdateHeader}
                    handleModalUpdate={handleOpenUpdateHeader}
                />
            )}

        </div>

    )
}

export default SingleQuiz