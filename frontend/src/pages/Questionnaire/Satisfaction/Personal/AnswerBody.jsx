import { useEffect, useState } from "react"
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack"
import useAuth from "../../../../hooks/useAuth";
import ButtonBlue from "../../../../components/ButtonBlue";
import Confirm from "../../../../components/Alerts/Confirm";

const AnswerBody = ({ sq }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [listQuestions, setListQuestions] = useState([]);
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
    const [errors, setErrors] = useState([]); // Estado para manejar errores de descripciones obligatorias
    const { authData } = useAuth();
    const urlGetQuestions = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_SATISFACTION_EMPLOYEE}/${sq.id_sq}`

    const [answerArray, setAnswerArray] = useState([]);

    const handleOpenModalConfirm = () => {
        // Verificar si hay preguntas obligatorias sin descripción
        const missingDescriptions = listQuestions
            .filter(question => question.is_obligatory === 1)
            .filter(question => !answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.description_dsc);

        if (missingDescriptions.length > 0) {
            // Si hay preguntas obligatorias sin descripción, agregarlas a los errores
            const errorList = missingDescriptions.map(question => ({
                questionId: question.id_qsq,
                message: `La descripción de la pregunta "${question.description_qsq}" es obligatoria.`
            }));
            setErrors(errorList);
        } else {
            // Si no hay errores, abrir el modal de confirmación
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
                    score_dsc: score
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    qsq_fk: questionId,
                    score_dsc: score,
                    description_dsc: ""
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
                    description_dsc: description
                };
                return updatedArray;
            }

            return [
                ...prevArray,
                {
                    qsq_fk: questionId,
                    score_dsc: "",
                    description_dsc: description
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
                                            className={` button__check__score ${answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.score_dsc === index + 1 ? 'button__check__score__selected' : ''}`}
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
                                value={answerArray.find(answer => answer.qsq_fk === question.id_qsq)?.description_dsc || ''}
                                onChange={(e) => handleDescriptionChange(question.id_qsq, e.target.value)}
                            />
                            {errors.find(error => error.questionId === question.id_qsq) && (
                                <span className="error-message bold">La descripción es obligatoria.</span>
                            )}
                        </div>
                    </div>

                    <div className="quiz__error">
                        {errorMessage.length > 0 && <p className="error-message bold">{errorMessage}</p>}
                        {successMessage.length > 0 && <p className="success-message bold">{successMessage}</p>}
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
                    redirectFunction={() => console.log(answerArray)}
                    skipFunction={() => handleOpenModalConfirm()}
                    buttonActionTitle="Enviar Respuestas"
                    buttonSkipTitle="Volver a las preguntas"
                />
            )}
        </div>
    )
}

export default AnswerBody;
