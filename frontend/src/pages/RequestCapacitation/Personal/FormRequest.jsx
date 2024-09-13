import { useState } from "react"
import ButtonRed from "../../../components/ButtonRed"
import ButtonBlue from "../../../components/ButtonBlue"
import ButtonEditable from "../../../components/Buttons/ButtonEditable"
import useAuth from "../../../hooks/useAuth"

const FormRequest = ({
    handleCloseFormRequest,
    handleStatusUpdated
}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccesMessage] = useState('');
    
    
    const { authData } = useAuth();
    const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_CAPACITATION_USER}`

    const [dataForm, setDataForm] = useState({
        title_rc: "",
        description_rc: ""
    })


    const handleChange = (e) => {
        const { name, value } = e.target;

        const data = {
            ...dataForm,
            [name]: value
        }

        setDataForm(data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const fetchCreateRequest = async () => {

                const response = await fetch(createOne, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    },
                    body: JSON.stringify({
                        dataForm
                    })
                })

                const dataFormatted = await response.json();

                if (response.status === 403) {
                    setErrorMessage(dataFormatted.message)
                }

                setErrorMessage('');
                setSuccesMessage(dataFormatted.message);
            }


            fetchCreateRequest();
            handleStatusUpdated();

        } catch (error) {
            console.log(error);
        }


    }

    return (
        <form method="" className="form__request__container">
            <div className="form__request__title">
                <h2>Formulario para solicitud de capacitación</h2>
                <span>Rellene el siguiente formulario para solicitar una capacitación trate de ser lo más especifico posible.</span>
            </div>
            <div className="form__request__body">
                <div className="form__request__body__title">
                    <div>
                        <label htmlFor="title_rc">Ingrese un asunto:</label>
                        <input
                            onChange={(e) => handleChange(e)}
                            className="input__form__div__input" placeholder="Ingrese un titulo o asunto" name="title_rc" type="text" />
                    </div>
                    <div>
                        <label htmlFor="description_rc">Ingrese una descripcion:</label>
                        <textarea
                            onChange={(e) => handleChange(e)}
                            placeholder="Amplie la solicitud de capacitación" className="input__form__div__input" name="description_rc" />
                    </div>
                    <div>
                        <span>Cantidad de caracteres: </span>
                    </div>
                </div>
                <div className="form__request__buttons">
                    <ButtonRed title={"Cerrar"} onClick={handleCloseFormRequest}
                    />


                    <ButtonBlue
                        title={"Enviar Solicitud"}
                        onClick={handleSubmit}
                    />
                </div>
                {errorMessage.length > 0 && <p className="error-message">{errorMessage}</p>}
                {successMessage.length > 0 && <p className="success-message">{successMessage}</p>}
            </div>
        </form>
    )
}


export default FormRequest