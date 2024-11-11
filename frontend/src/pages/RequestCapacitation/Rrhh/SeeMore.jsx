import { useEffect, useState } from "react";
import ButtonBlue from "../../../components/ButtonBlue";
import ButtonRed from "../../../components/ButtonRed";
import useAuth from "../../../hooks/useAuth";


const SeeMore = ({
    initialData,
    closeModalAnswer,
}) => {

    console.log(initialData)

    return (
        <div className="alert__background__black" onClick={(e) => e.stopPropagation()}>
            <div className="preferences__modal__container">
                <div className="preferences__modal__content">

                    <div className="answer__modal__data">
                        <div className="not__answer__header__profile">
                            <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${initialData.avatar_user}`} alt="" />
                            <p>{`${initialData.name_entity} ${initialData.lastname_entity}`}</p>
                        </div>

                        <div className="not__answer__body__description answer__body">

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Titulo o asunto:</p>
                                <h3 className="div__form__input__input">{initialData.title_rc}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label  title__modal__answer">Descripcion:</p>
                                <h3 className="div__form__input__input">{initialData.description_rc}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Fecha de solicitud:</p>
                                <h3 className="div__form__input__input">{initialData.date_requested}</h3>
                            </div>

                        </div>
                    </div>

                    <div className="not__answer__body__description answer__body">

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Respondido por:</p>
                                <h3 className="div__form__input__input">{`${initialData.author_name != null ? initialData.author_name : '-'} ${initialData.author_lastname != null ? initialData.author_lastname : ''}`}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Respondido el:</p>
                                <h3 className="div__form__input__input">{initialData.answered_at}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Descripción en la respuesta:</p>
                                <h3 className="div__form__input__input">{initialData.description_rrc != null ? initialData.description_rc : '-'}</h3>
                            </div>


                        <div className="answer__modal__buttons">
                            <ButtonRed
                                title={"Salir"}
                                onClick={closeModalAnswer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SeeMore;