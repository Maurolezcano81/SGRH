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

    const formatDateYear = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
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
                                <h3 className="div__form__input__input">{initialData.name_tol}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label  title__modal__answer">Descripcion:</p>
                                <h3 className="div__form__input__input">{initialData.reason_lr}</h3>
                            </div>

                            <div className="not__answer__body__item answer__body__item">
                                <p className="div__form__input__label title__modal__answer">Fecha de solicitud:</p>
                                <h3 className="div__form__input__input">{initialData.date_requested}</h3>
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
                            <h3 className="div__form__input__input">{`${initialData.author_name} ${initialData.author_lastname}`}</h3>
                        </div>

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Respondido el:</p>
                            <h3 className="div__form__input__input">{initialData.answered_at || "-"}</h3>
                        </div>

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Respuesta:</p>
                            <h3 className="div__form__input__input">{initialData.name_sr || "-"}</h3>
                        </div>

                        <div className="not__answer__body__item answer__body__item">
                            <p className="div__form__input__label title__modal__answer">Descripción en la respuesta:</p>
                            <h3 className="div__form__input__input">{initialData && initialData.description_lrr.length > 0 ? initialData.description_lrr : "No hay descripción" }</h3>
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