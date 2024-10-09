import { useEffect, useState } from "react"
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack"
import useAuth from "../../../../hooks/useAuth";
import ButtonBlue from "../../../../components/ButtonBlue";
import Confirm from "../../../../components/Alerts/Confirm";
import AlertSuccesfully from "../../../../components/Alerts/AlertSuccesfully";
import AlertError from "../../../../components/Alerts/AlertError";
import { useNavigate } from "react-router-dom";
import ModalTableWFilters from "../../../../components/Modals/Updates/ModalTableWFilters";
import AddEmployee from '.././../../../assets/Icons/Buttons/AddEmployee.png'
import ButtonImgTxt from "../../../../components/ButtonImgTex";
import Trash from '../../../../assets/Icons/Preferences/Trash.png'

const AnswerBody = ({ ep }) => {
    const [errorMessage, setErrorMessage] = useState("");

    const [isCriticalErrorOpen, setIsCriticalErrorOpen] = useState(false);
    const [criticalErrorMessage, setCriticalErrorMessage] = useState("");

    const [isSuccesOpen, setIsSuccesOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [listQuestions, setListQuestions] = useState([]);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [errors, setErrors] = useState([]);
    const urlGetQuestions = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_PERFORMANCE_SUPERVISOR_QUESTIONS}/${ep.id_ep}`

    const [answerArray, setAnswerArray] = useState([]);


    const { authData } = useAuth();
    const navigate = useNavigate()

    const handleOpenModalConfirm = () => {
        const missingDescriptions = listQuestions
            .filter(question => question.is_obligatory === 1)
            .filter(question => !answerArray.find(answer => answer.epq_fk === question.id_epq)?.question_epq);

        if (missingDescriptions.length > 0) {
            const errorList = missingDescriptions.map(question => ({
                questionId: question.id_epq,
                message: `La descripción de la pregunta "${question.question_epq}" es obligatoria.`
            }));
            setErrors(errorList);
        } else {
            setIsOpenModalConfirm(!isOpenModalConfirm);
        }
    }

    const handleScoreChange = (questionId, score) => {
        setAnswerArray(prevArray => {
            const existingAnswerIndex = prevArray.findIndex(answer => answer.epq_fk === questionId);

            if (existingAnswerIndex !== -1) {
                const updatedArray = [...prevArray];
                updatedArray[existingAnswerIndex] = {
                    ...updatedArray[existingAnswerIndex],
                    score_dep: score
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    epq_fk: questionId,
                    score_dep: score,
                    question_epq: ""
                }
            ];
        });
    }

    const handleDescriptionChange = (questionId, description) => {
        setAnswerArray(prevArray => {
            const existingAnswerIndex = prevArray.findIndex(answer => answer.epq_fk === questionId);

            if (existingAnswerIndex !== -1) {
                const updatedArray = [...prevArray];
                updatedArray[existingAnswerIndex] = {
                    ...updatedArray[existingAnswerIndex],
                    question_epq: description
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    epq_fk: questionId,
                    score_dep: "",
                    question_epq: description
                }
            ];
        });
    }

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch(urlGetQuestions, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            const data = await response.json();

            if (response.status === 403) {
                setErrorMessage(data.message);
            }

            setListQuestions(data.queryResponse);
        };

        fetchQuestions();
    }, [authData.token, urlGetQuestions]);


    const urlSubmitAnswer = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_QUIZ_PERFORMANCE_ANSWER}`

    const handleSubmit = async () => {

        const response = await fetch(urlSubmitAnswer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authData.token}`
            },
            body: JSON.stringify({
                answerData: {
                    ...ep,
                    evaluated_fk: employeeSelected.id_user
                },
                answersArray: answerArray
            })
        })

        const data = await response.json();


        if (response.status === 403) {
            setErrorMessage(data.message)
            setSuccessMessage("")
            setCriticalErrorMessage("Ha ocurrido un error en las respuestas del cuestionario, revise la informacion e intentelo de nuevo")
            setIsOpenModalConfirm(false);
            setIsCriticalErrorOpen(true);

            setTimeout(() => {
                setCriticalErrorMessage(false);
            }, 1500)
            return
        } else if (response.status === 500) {
            setErrorMessage("")
            setSuccessMessage("")
            setCriticalErrorMessage(data.message)
            setIsOpenModalConfirm(false);
            setIsCriticalErrorOpen(true);
            setTimeout(() => {
                setCriticalErrorMessage(false);
            }, 1500)
        }

        setErrorMessage("");
        setCriticalErrorMessage("")
        setSuccessMessage(data.message);
        setIsOpenModalConfirm(false)
        setIsSuccesOpen(true);

        setTimeout(() => {
            setIsSuccesOpen(false);
            navigate("/supervisor/rendimiento")
        }, 1500)

    }

    const [employeeSelected, setEmployeeSelected] = useState({});
    const [selectedEmployeeArrayToExclude, setSelectedEmployeeArrayToExclude] = useState([]);

    const [isAddSupervisorModalOpen, setIsAddSupervisorModalOpen] = useState(false);
    const [isStatusUpdate, setIsStatusUpdate] = useState(false);

    const getEmployeesUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_EMPLOYEES_TO_EVALUATE_DEPARTMENT}`;

    const handleOpenModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(true);
    };

    const handleCloseModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(false);
    };

    const columsToModal = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_occupation', label: 'Puesto de Trabajo' },
    ];

    const filtersToModal = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION}`,
        },
    ];

    const searchOptionsToModal = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },
    ];

    const selectEmployee = (row) => {
        setEmployeeSelected({
            id_user: row.id_user,
            name_entity: row.name_entity,
            lastname_entity: row.lastname_entity,
            avatar_user: row.avatar_user,
            name_department: row.name_department,
        });

        setSelectedEmployeeArrayToExclude((prevArray) => [...prevArray, row.id_user]);

        handleCloseModalAddSupervisor();
    };

    const deleteSupervisor = (row) => {
        setEmployeeSelected({});

        setSelectedEmployeeArrayToExclude((prevArray) =>
            prevArray.filter((id) => id !== row.id_user)
        );
    };
    return (
        <div className="container__content">


            {Object.keys(employeeSelected).length < 1 && (
                <div className="margin-y-1">
                    <ButtonWhiteOutlineBlack
                        title={"+ Agregar persona a evaluar"}
                        onClick={() => handleOpenModalAddSupervisor()}
                        full={true}
                    />
                </div>

            )}

            {Object.keys(employeeSelected).length > 0 && (
                <div className="quiz__header__container margin-y-1">
                    <div className="container__content">
                        <h4>Persona a Evaluar</h4>
                        <div className="quiz__supervisors__container">
                            <div className="not__answer__header__profile">
                                <img
                                    src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${employeeSelected.avatar_user}`}
                                    alt=""
                                />
                            </div>

                            <div>
                                <h4>{`${employeeSelected.name_entity} ${employeeSelected.lastname_entity}`}</h4>
                                <p className="info__message">{employeeSelected.name_department}</p>
                            </div>

                            <div>
                                <ButtonImgTxt
                                    img={Trash}
                                    title={"Quitar"}
                                    color={"red"}
                                    onClick={() => deleteSupervisor(employeeSelected)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAddSupervisorModalOpen && (
                <ModalTableWFilters
                    url={getEmployeesUrl}
                    authToken={authData.token}
                    columns={columsToModal}
                    filterConfigs={filtersToModal}
                    searchOptions={searchOptionsToModal}
                    initialSearchField={'name_entity'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_entity', order: 'ASC' }}
                    actions={{
                        view: (row) => selectEmployee(row),
                        edit: (row) => console.log('Editar', row),
                        delete: (row) => console.log('Editar', row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false,
                    }}
                    actionColumn='id_entity'
                    paginationLabelInfo={'Personas'}
                    buttonOneInfo={{ img: AddEmployee, color: 'blue', title: 'Evaluar Personal' }}
                    isStatusUpdated={setIsStatusUpdate}
                    handleCloseModal={handleCloseModalAddSupervisor}
                    title_table={"Lista de Personas"}
                    colorTable={'bg__green-5'}
                    arrayToExclude={selectedEmployeeArrayToExclude}
                />
            )}

            {
                listQuestions && listQuestions.map((question) => (
                    <form className="quiz__body__question__container" key={question.id_epq}>
                        <div className="question__title__container">
                            <p>{question.question_epq}</p>
                        </div>

                        <div className="flex flex-col">
                            <h4 className="bold">Seleccione una respuesta:</h4>
                            <div className="score-buttons">
                                <div className="flex flex-col gap-2">
                                    <p>{question.bad_parameter_dep}</p>
                                    <div className="flex justify-between">
                                        {[...Array(10)].map((_, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                className={` button__check__score ${answerArray.find(answer => answer.epq_fk === question.id_epq)?.score_dep === index + 1 ? 'button__check__score__selected' : ''}`}
                                                onClick={() => handleScoreChange(question.id_epq, index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <p>{question.best_parameter_dep}</p>
                                </div>
                            </div>
                        </div>

                        <div className="quiz__question__check__container">
                            <div className="flex flex-col gap-2 w-full">
                                {question.is_obligatory === 1 && (
                                    <p className="is__obligatory__message">La observación es obligatoria.</p>
                                )}

                                {question.is_obligatory === 0 && (
                                    <p className="is__obligatory__message">Ingrese una observación, en caso de que sea necesario.</p>
                                )}
                                <input
                                    placeholder="Observación"
                                    className={`w-full ${errors.find(error => error.questionId === question.id_epq) ? 'input-error' : ''}`}
                                    type="text"
                                    name="question_epq"
                                    value={answerArray.find(answer => answer.epq_fk === question.id_epq)?.question_epq || ''}
                                    onChange={(e) => handleDescriptionChange(question.id_epq, e.target.value)}
                                />
                                {errors.find(error => error.questionId === question.id_epq) && (
                                    <span className="error-message bold">La observación es obligatoria.</span>
                                )}
                            </div>
                        </div>

                        <div className="quiz__error">
                            {errorMessage.length > 0 && <p className="error-message bold">{errorMessage}</p>}
                        </div>
                    </form>
                ))
            }

            <div className="form__button__container">
                <ButtonBlue
                    title={"Enviar Respuestas"}
                    onClick={() => handleOpenModalConfirm()}
                />
            </div>

            {
                isOpenModalConfirm && (
                    <Confirm
                        message="Al confirmar el envío del formulario, este no podrá modificarse, verifique la información dos veces."
                        redirectFunction={() => handleSubmit()}
                        skipFunction={() => handleOpenModalConfirm()}
                        buttonActionTitle="Enviar Respuestas"
                        buttonSkipTitle="Volver a las preguntas"
                    />
                )
            }

            {
                isSuccesOpen && successMessage.length > 0 && (
                    <AlertSuccesfully
                        message={successMessage}
                    />
                )
            }

            {
                isCriticalErrorOpen && criticalErrorMessage.length > 0(
                    <AlertError
                        errorMessage={criticalErrorMessage}
                    />
                )
            }

        </div >
    )
}

export default AnswerBody;
