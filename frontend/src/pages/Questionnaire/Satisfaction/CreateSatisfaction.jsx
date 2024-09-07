import { useState } from "react"
import HeaderCreate from "./Components/HeaderCreate"
import BodyCreate from "./Components/BodyCreate"


const CreateSatisfaction = () => {

    const [headerQuiz, setHeaderQuiz] = useState({
        name_sq: "",
        start_sq: "",
        end_sq: "",
    })

    const [questionStructure, setQuestionStructure] = useState({
        description_qsq: "",
        is_obligatory: "",
    })

    return (
        <div className="container__page">
            <div className='container__content'>

                <HeaderCreate
                    title={"Cuestionario de Satisfacción"}
                    fields={headerQuiz}
                    placeholders={{ title: "Ingrese un titulo" }}
                />

                <BodyCreate 
                    questionStructure={questionStructure}
                    questionData={{input_name: "description_qsq", radius_name: "is_obligatory"}}
                />

            </div>
        </div>
    )
}

export default CreateSatisfaction