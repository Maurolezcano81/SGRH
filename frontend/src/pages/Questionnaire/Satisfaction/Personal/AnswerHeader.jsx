import useAuth from "../../../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";


const AnswerHeader = ({
    sq
}) => {

    return (

            <div className='container__content quiz'>
                <div className="quiz__header__container">
                    <div className="container__content">
                        <div className="quiz__header__section">
                            <div className="quiz__header__title">
                            </div>
                    
                        </div>

                        <div className="quiz__header__section">
                            <h4>{sq.name_sq || ""}</h4>
                            <div className="quiz__header__dates">
                            <div className="quiz__header__date">
                                    <p className="quiz__label" >Cantidad de Preguntas:</p>
                                    <p className="quiz__label">{sq.quantity_questions}</p>
                                </div>

                                <div className="quiz__header__date">
                                    <p className="quiz__label" >Fecha de inicio:</p>
                                    <p className="quiz__label">{sq.start_sq}</p>
                                </div>

                                <div className="quiz__header__date">
                                    <p className="quiz__label">Fecha de Finalizacion:</p>
                                    <p className="quiz__label">{sq.end_sq}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AnswerHeader;