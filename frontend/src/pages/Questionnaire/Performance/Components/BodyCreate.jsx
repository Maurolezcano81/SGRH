import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';  // Asegúrate de tener instalada la biblioteca uuid
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack";

const BodyCreate = ({ questionStructure, questionData, setBodyQuiz }) => {
    const [listQuestions, setListQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateQuestions = () => {
        for (const question of listQuestions) {
            if (!question[questionData.input_name_question] ||
                !question[questionData.input_name_description] ||
                !question[questionData.radius_name] ||
                !question[questionData.bad_parameter_epq] ||
                !question[questionData.best_parameter_epq]) {
                return false;
            }
        }
        return true;
    };

    const addQuestion = () => {
        if (validateQuestions()) {
            const newQuestion = { ...questionStructure, id: uuidv4() };
            setListQuestions([...listQuestions, newQuestion]);
            setErrorMessage('');
        } else {
            setErrorMessage('Por favor, completa todos los campos antes de agregar una nueva pregunta.');
        }
    };

    const deleteQuestion = (idToDelete) => {
        const newData = listQuestions.filter(question => question.id !== idToDelete);
        setListQuestions(newData);
    };

    const handleChange = (id, e) => {
        const data = [...listQuestions];
        const index = data.findIndex(question => question.id === id);
        if (index !== -1) {
            data[index][e.target.name] = e.target.value;
            setListQuestions(data);
            setBodyQuiz(data);
        }
    };

    return (
        <div className="quiz__header__container">
            <div className="container__content">

            <h4>Cuerpo del Cuestionario</h4>



            <div className="quiz__body__section">
                {listQuestions.map((question, index) => (
                    <div key={question.id} className="quiz__body__question__container">
                        <div className="question__title__container">
                            <label htmlFor={`question_${question.id}`}>Pregunta {index + 1}</label>
                            <button
                                onClick={() => deleteQuestion(question.id)}
                                className="quiz__question__delete"
                            >
                                Eliminar pregunta
                            </button>
                        </div>

                        <label htmlFor={questionData.input_name_question}>
                            Titulo de la pregunta:
                        </label>
                        <input
                            onChange={(e) => handleChange(question.id, e)}
                            name={questionData.input_name_question}
                            type="text"
                            placeholder="Escribe la pregunta"
                        />

                        <label htmlFor={questionData.input_name_description}>
                            Descripcion de la pregunta:
                        </label>
                        <input
                            onChange={(e) => handleChange(question.id, e)}
                            name={questionData.input_name_description}
                            type="text"
                            placeholder="Escribe una descripcion para ampliar la pregunta"
                        />

                        <div className="quiz__question__check__container">
                            <p>Marcar como obligatoria</p>
                            <div className="quiz__radio__obligatory">
                                <label>
                                    Si
                                    <input
                                        onChange={(e) => handleChange(question.id, e)}
                                        name={questionData.radius_name}
                                        value="1"
                                        type="radio"
                                    />
                                </label>
                                <label>
                                    No
                                    <input
                                        onChange={(e) => handleChange(question.id, e)}
                                        name={questionData.radius_name}
                                        value="0"
                                        type="radio"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="quiz__example__container">
                            <label>
                                Texto de parámetro mínimo
                                <input
                                    onChange={(e) => handleChange(question.id, e)}
                                    name={questionData.bad_parameter_epq}
                                    type="text"
                                />
                            </label>

                            <label>
                                Texto de parámetro máximo
                                <input
                                    onChange={(e) => handleChange(question.id, e)}
                                    name={questionData.best_parameter_epq}
                                    type="text"
                                />
                            </label>
                        </div>
                    </div>
                ))}

                <div className="quiz__error">
                    {errorMessage.length > 0 && <p className="error-message">{errorMessage}</p>}
                    {successMessage.length > 0 && <p className="success-message">{successMessage}</p>}
                </div>


                <ButtonWhiteOutlineBlack
                    title={"+ Agregar Pregunta"}
                    onClick={addQuestion}
                    full={true}
                />
            </div>
            </div>
        </div>
    );
};

export default BodyCreate;
