import { useState } from "react"
import HeaderCreate from "./Components/HeaderCreate"
import BodyCreate from "./Components/BodyCreate"
import ButtonBlue from "../../../components/ButtonBlue"
import useAuth from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"


const CreateSatisfaction = () => {

    const [headerQuiz, setHeaderQuiz] = useState({
        name_sq: "",
        start_sq: "",
        end_sq: "",
    })

    const [questionStructure, setQuestionStructure] = useState({
        description_qsq: "",
        is_obligatory: "",
        bad_parameter_qsq: "",
        best_parameter_qsq: ""
    })

    const fields_header = {
        name_sq: "name_sq",
        start_sq: "start_sq",
        end_sq: "end_sq"
    }
    const [bodyQuiz, setBodyQuiz] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const apiToCreate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_QUIZ}`
    const { authData } = useAuth();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {

            const fetchResponse = await fetch(apiToCreate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    headerQuiz: headerQuiz,
                    questionQuiz: bodyQuiz
                })
            })

            const data = await fetchResponse.json();

            if (fetchResponse.status === 403) {
                setErrorMessage(data.message)
                setSuccessMessage('');
                return;
            }

            setErrorMessage('');
            setSuccessMessage(data.message);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="container__page">
            <div className='container__content quiz'>

                <HeaderCreate
                    title={"Cuestionario de Satisfacción"}
                    fields={fields_header}
                    placeholders={{ title: "Ingrese un titulo" }}
                    setHeaderQuiz={setHeaderQuiz}
                />

                <BodyCreate
                    questionStructure={questionStructure}
                    questionData={{ input_name: "description_qsq", radius_name: "is_obligatory", bad_parameter_qsq: 'bad_parameter_qsq', best_parameter_qsq: 'best_parameter_qsq' }}
                    setBodyQuiz={setBodyQuiz}
                />

            </div>


            <div className="quiz__error">
                {errorMessage.length > 0 && <p className="error-message">{errorMessage}</p>}
                {successMessage.length > 0 && <p className="success-message">{successMessage}</p>}
            </div>

            <div className="quiz__button__submit">

                <ButtonBlue
                    title={"Crear cuestionario"}
                    onClick={(e) => {
                        handleFormSubmit(e)
                    }}
                />
            </div>
        </div>
    )
}

export default CreateSatisfaction