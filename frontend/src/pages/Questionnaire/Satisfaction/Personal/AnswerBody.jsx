import { useEffect, useState } from "react"
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack"
import useAuth from "../../../../hooks/useAuth";
import ButtonBlue from "../../../../components/ButtonBlue";
import Confirm from "../../../../components/Alerts/Confirm";
import AlertSuccesfully from "../../../../components/Alerts/AlertSuccesfully";
import AlertError from "../../../../components/Alerts/AlertError";
import { useNavigate } from "react-router-dom";

const AnswerBody = ({ sq }) => {

    const [errorMessage, setErrorMessage] = useState("");

    const [isCriticalErrorOpen, setIsCriticalErrorOpen] = useState(false);
    const [criticalErrorMessage, setCriticalErrorMessage] = useState("");

    const [isSuccesOpen, setIsSuccesOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [listQuestions, setListQuestions] = useState([]);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [errors, setErrors] = useState([]); // Estado para manejar errores de descripciones obligatorias
    const urlGetQuestions = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_SATISFACTION_EMPLOYEE}/${sq.id_sq}`

    const [answerArray, setAnswerArray] = useState([]);

    const { authData } = useAuth();
    const navigate = useNavigate()

    const handleOpenModalConfirm = () => {
        const missingDescriptions = listQuestions
            .filter(question => question.is_obligatory === 1)
            .filter(question => !answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.description_dsq);

        if (missingDescriptions.length > 0) {
            const errorList = missingDescriptions.map(question => ({
                questionId: question.id_qsq,
                message: `La descripción de la pregunta "${question.description_qsq}" es obligatoria.`
            }));
            setErrors(errorList);
        } else {
            setIsOpenModalConfirm(!isOpenModalConfirm);
        }
    }

    const handleScoreChange = (questionId, score) => {
        setAnswerArray(prevArray => {
            const existingAnswerIndex = prevArray.findIndex(answer => answer.qsq_fk === questionId);

            if (existingAnswerIndex !== -1) {
                const updatedArray = [...prevArray];
                updatedArray[existingAnswerIndex] = {
                    ...updatedArray[existingAnswerIndex],
                    score_dsq: score
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    qsq_fk: questionId,
                    score_dsq: score,
                    description_dsq: ""
                }
            ];
        });
    }

    const handleDescriptionChange = (questionId, description) => {
        setAnswerArray(prevArray => {
            const existingAnswerIndex = prevArray.findIndex(answer => answer.qsq_fk === questionId);

            if (existingAnswerIndex !== -1) {
                const updatedArray = [...prevArray];
                updatedArray[existingAnswerIndex] = {
                    ...updatedArray[existingAnswerIndex],
                    description_dsq: description
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    qsq_fk: questionId,
                    score_dsq: "",
                    description_dsq: description
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

            setListQuestions(data.list);
        };

        fetchQuestions();
    }, [authData.token, urlGetQuestions]);


    const urlSubmitAnswer = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_QUIZ_SATISFACTION_ANSWER}`

    const handleSubmit = async () => {

        const response = await fetch(urlSubmitAnswer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authData.token}`
            },
            body: JSON.stringify({
                answerData: sq,
                answersArray: answerArray
            })
        })

        const data = await response.json();

        console.log(data)

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
            navigate("/personal/satisfaccion/ver")
        }, 1500)

    }

    return (
        <div className="container__content">
            {listQuestions && listQuestions.map((question) => (
                <form className="quiz__body__question__container" key={question.id_qsq}>
                    <div className="question__title__container">
                        <p>{question.description_qsq}</p>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="bold">Seleccione una respuesta:</h4>
                        <div className="score-buttons">
                            <div className="flex flex-col gap-2">
                                <p>{question.bad_parameter_qsq}</p>
                                <div className="flex justify-between">
                                    {[...Array(10)].map((_, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={` button__check__score ${answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.score_dsq === index + 1 ? 'button__check__score__selected' : ''}`}
                                            onClick={() => handleScoreChange(question.id_qsq, index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                <p>{question.best_parameter_qsq}</p>
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
                                className={`w-full ${errors.find(error => error.questionId === question.id_qsq) ? 'input-error' : ''}`}
                                type="text"
                                name="description_dsq"
                                value={answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.description_dsq || ''}
                                onChange={(e) => handleDescriptionChange(question.id_qsq, e.target.value)}
                            />
                            {errors.find(error => error.questionId === question.id_qsq) && (
                                <span className="error-message bold">La observación es obligatoria.</span>
                            )}
                        </div>
                    </div>

                    <div className="quiz__error">
                        {errorMessage.length > 0 && <p className="error-message bold">{errorMessage}</p>}
                    </div>
                </form>
            ))}

            <div className="form__button__container">
                <ButtonBlue
                    title={"Enviar Respuestas"}
                    onClick={() => handleOpenModalConfirm()}
                />
            </div>

            {isOpenModalConfirm && (
                <Confirm
                    message="Al confirmar el envío del formulario, este no podrá modificarse, verifique la información dos veces."
                    redirectFunction={() => handleSubmit()}
                    skipFunction={() => handleOpenModalConfirm()}
                    buttonActionTitle="Enviar Respuestas"
                    buttonSkipTitle="Volver a las preguntas"
                />
            )}

            {isSuccesOpen && successMessage.length > 0 && (
                <AlertSuccesfully
                message={successMessage}
                />
            )}

            {isCriticalErrorOpen && criticalErrorMessage.length > 0 (
                <AlertError 
                errorMessage={criticalErrorMessage}
                />
            )}

        </div>
    )
}

export default AnswerBody;
