import { useState } from "react"
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack"

const BodyCreate = ({ questionStructure, questionData }) => {
    let [listQuestions, setListQuestions] = useState([])

    const addQuestion = () => {
        const newQuestion = { ...questionStructure, id: listQuestions.length }
        setListQuestions([...listQuestions, newQuestion])
    }

    const deleteQuestion = (e) =>{
        const indexToDelete = e.target.value;
        const data = [...listQuestions]
        const newData = data.filter( (index) => {
            index.id != indexToDelete
            console.log(index)
            console.log(index.id)
        })

        console.log(newData)
        setListQuestions(newData)
    }


    const handleChange = (index, e) => {
        const data = [...listQuestions]
        data[index][e.target.name] = e.target.value
        setListQuestions(data)
        console.log(listQuestions)
    }

    return (
        <div className="quiz__body__section">
            <h4>Cuerpo del Cuestionario</h4>
            {listQuestions.map((question, index) => (
                <div key={index} className="quiz__body__question__container">
                    <div className="question__title__container">
                    <label htmlFor={`question_${index}`}>Pregunta {index + 1}</label>
                    <button onClick={(e) => deleteQuestion(e)} className="quiz__question__delete">Eliminar pregunta</button>
                    </div>
                    <input
                        onChange={(e) => handleChange(index, e)}
                        name={questionData.input_name}  // Aquí usa un nombre fijo o ajusta según lo que necesites
                        type="text"
                    />

                    <div className="quiz__question__check__container">
                        <p >Marcar como obligatoria</p>
                        <div className="quiz__radio__obligatory">
                            <label htmlFor={question.radius_name}>Si
                                <input onChange={(e) => handleChange(index, e)} name={questionData.radius_name} value="1" type="radio" />
                            </label>
                            <label htmlFor={question.radius_name}>
                                No
                                <input onChange={(e) => handleChange(index, e)} name={questionData.radius_name} value="0" type="radio" />

                            </label>
                        </div>
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
