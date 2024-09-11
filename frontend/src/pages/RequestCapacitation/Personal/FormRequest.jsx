import { useState } from "react"
import ButtonRed from "../../../components/ButtonRed"
import ButtonBlue from "../../../components/ButtonBlue"
import ButtonEditable from "../../../components/Buttons/ButtonEditable"

const FormRequest = ({
    handleCloseFormRequest,
}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [dataForm, setDataForm] = useState({})


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Asd")
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
                        <input className="input__form__div__input" placeholder="Ingrese un titulo o asunto" name="title_rc" type="text" />
                    </div>
                    <div>
                        <label htmlFor="description_rc">Ingrese una descripcion:</label>
                        <textarea placeholder="Amplie la solicitud de capacitación" className="input__form__div__input" name="description_rc" />
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
                {errorMessage && (
                    <div className="preferences__modal__error">
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    )
}


export default FormRequest