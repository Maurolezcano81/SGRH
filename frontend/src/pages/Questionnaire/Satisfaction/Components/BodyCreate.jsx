import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';  // Asegúrate de tener instalada la biblioteca uuid
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack"

const BodyCreate = ({ questionStructure, questionData }) => {
    const [listQuestions, setListQuestions] = useState([])

    const addQuestion = () => {
        const newQuestion = { ...questionStructure, id: uuidv4() }
        setListQuestions([...listQuestions, newQuestion])
    }

    const deleteQuestion = (idToDelete) => {
        const newData = listQuestions.filter(question => question.id !== idToDelete)
        setListQuestions(newData)
    }

    const handleChange = (id, e) => {
        const data = [...listQuestions]
        const index = data.findIndex(question => question.id === id)
        if (index !== -1) {
            data[index][e.target.name] = e.target.value
            setListQuestions(data)
        }
        console.log(listQuestions)
    }

    return (
        <div className="quiz__body__section">
            <h4>Cuerpo del Cuestionario</h4>
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
                    <input
                        onChange={(e) => handleChange(question.id, e)}
                        name={questionData.input_name}
                        type="text"
                    />

                    <div className="quiz__question__check__container">
                        <p>Marcar como obligatoria</p>
                        <div className="quiz__radio__obligatory">
                            <label htmlFor={question.radius_name}>Si
                                <input
                                    onChange={(e) => handleChange(question.id, e)}
                                    name={questionData.radius_name}
                                    value="1"
                                    type="radio"
                                />
                            </label>
                            <label htmlFor={question.radius_name}>
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
                        <label clas htmlFor={question.bad_parameter_qsq}>
                            Texto de parametro minimo
                            <input
                                onChange={(e) => handleChange(question.id, e)}
                                name={questionData.bad_parameter_qsq}
                                type="input"
                            />
                        </label>

                        <div className="quiz__example__radio__container">
                            <label className="quiz__example__label__radio">
                                1
                                <input disabled={true} type="radio" />
                            </label>

                            <label className="quiz__example__label__radio">
                                2
                                <input disabled={true} type="radio" />
                            </label>

                            <label className="quiz__example__label__radio">
                                3
                                <input disabled={true} type="radio" />
                            </label>
                        </div>

                            <label htmlFor={question.best_parameter_qsq}>
                                Texto de parametro maximo
                                <input
                                    onChange={(e) => handleChange(question.id, e)}
                                    name={questionData.best_parameter_qsq}
                                    type="input"
                                />
                            </label>
                    </div>

                </div>
            ))}

            <ButtonWhiteOutlineBlack
                title={"+ Agregar Pregunta"}
                onClick={addQuestion}
                full={true}
            />
        </div>
    )
}

export default BodyCreate
