import { useState } from "react";
import ButtonWhiteOutlineBlack from "../../../../components/Buttons/ButtonWhiteOutlineBlack";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";

const HeaderCreate = ({
    title,
    fields,
    placeholders,
    setHeaderQuiz
}) => {


    const handleChange = (e) => {
        const {name, value} = e.target
        setHeaderQuiz((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <>
            <PreferenceTitle title={title} />

            <div className="quiz__header__container">
                <div className="quiz__header__section">
                    <div className="quiz__header__title">
                        <label className="quiz__label quiz__title" htmlFor={fields.name_ep}>Titulo del cuestionario:</label>
                        <input onChange={handleChange} placeholder={placeholders.title} className="quiz__input" name={fields.name_ep} type="text" />
                    </div>

                </div>

                <div className="quiz__header__section">
                    <h4>Configuracion de Fechas</h4>
                    <div className="quiz__header__dates">
                        <div className="quiz__header__date">
                            <label className="quiz__label" htmlFor={fields.start_ep}>Fecha de inicio:</label>
                            <input onChange={handleChange} className="quiz__input" name={fields.start_ep} type="date" />
                        </div>

                        <div className="quiz__header__date">
                            <label className="quiz__label" htmlFor={fields.end_ep}>Fecha de inicio:</label>
                            <input onChange={handleChange} className="quiz__input" name={fields.end_ep} type="date" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}


export default HeaderCreate;