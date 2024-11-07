import { useEffect, useState } from "react";
import ButtonBlue from "../../../components/ButtonBlue";
import ButtonRed from "../../../components/ButtonRed";
import useAuth from "../../../hooks/useAuth";
import ImgModal from "../../../components/Attachments/ImgModal";


const SeeMore = ({
    initialData,
    closeModalAnswer,
}) => {


    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [urlForAttachmentModal, setUrlForAttachmentModal] = useState(null);

    const handleOpenAttachmentModal = (url) => {
        setIsAttachmentModalOpen(true);
        setUrlForAttachmentModal(url);
    }

    const handleCloseAttachmentModal = () => {
        setIsAttachmentModalOpen(false);
    }

    return (
        <div className="alert__background__black" onClick={(e) => e.stopPropagation()}>
            <div className="preferences__modal__container">
                <div className="preferences__modal__content">

                    <div className="answer__modal__data">
                        <div className="not__answer__header__profile">
                            <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${initialData.avatar_user}`} alt="" />
                            <p>{initialData.requestor_name}</p>
                        </div>

                        <div className="not__answer__body__description answer__body">

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Titulo o asunto:</p>
                                <h3 className="div__form__input__input">{initialData.name_tol}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label  title__modal__answer">Descripcion:</p>
                                <h3 className="div__form__input__input">{initialData.reason_lr}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Fecha de solicitud:</p>
                                <h3 className="div__form__input__input">{initialData.created_at}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Fecha de inicio:</p>
                                <h3 className="div__form__input__input">{initialData.start_lr}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Fecha de fin:</p>
                                <h3 className="div__form__input__input">{initialData.end_lr}</h3>
                            </div>

                            {initialData && initialData.attachments.length > 0 && (
                                <>
                                    <h3>Adjuntos:</h3>
                                    <div className="attachment__container">
                                        {initialData.attachments.map((attachment) => (
                                            <div onClick={() => handleOpenAttachmentModal(attachment.value_alr)}>
                                                <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${attachment.value_alr}`} alt="No se pudo cargar." />
                                            </div>
                                        ))}
                                    </div>
                                </>

                            )}

                        </div>
                    </div>

                    <div className="not__answer__body__description answer__body">

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Respondido por:</p>
                            <h3 className="div__form__input__input">{initialData.answered_by}</h3>
                        </div>

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Respondido el:</p>
                            <h3 className="div__form__input__input">{initialData.answered_at || "-"}</h3>
                        </div>

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Descripción en la respuesta:</p>
                            <h3 className="div__form__input__input">{initialData.description_lrr}</h3>
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

            {isAttachmentModalOpen && (
                <ImgModal
                    img={urlForAttachmentModal}
                    closeFunction={handleCloseAttachmentModal}
                />
            )}
        </div>
    )
};

export default SeeMore;