import { useEffect, useState } from "react";
import ButtonBlue from "../../../components/ButtonBlue";
import ButtonRed from "../../../components/ButtonRed";
import useAuth from "../../../hooks/useAuth";
import ImgModal from "../../../components/Attachments/ImgModal";


const ModalAnswer = ({
    initialData,
    closeModalAnswer,
    setDependencyToRefresh,
    dependencyToRefresh
}) => {


    const { authData } = useAuth();

    const urlAnswer = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_LEAVE_ANSWER_RRHH}`
    const urlGetData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_STATUS_REQUEST}`

    const [dataToAnswerFetch, setDataToAnswerFetch] = useState({
        lr_fk: initialData.id_lr,
        sr_fk: "",
        description_lrr: ""
    })

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccesMessage] = useState('');

    const [statusRequest, setStatusRequest] = useState([]);

    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [urlForAttachmentModal, setUrlForAttachmentModal] = useState(null);

    const handleOpenAttachmentModal = (url) => {
        setIsAttachmentModalOpen(true);
        setUrlForAttachmentModal(url);
    }

    const handleCloseAttachmentModal = () => {
        setIsAttachmentModalOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        const data = {
            ...dataToAnswerFetch,
            [name]: value
        }

        return setDataToAnswerFetch(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fetchResponse = await fetch(urlAnswer, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(dataToAnswerFetch)
            })

            const dataFormatted = await fetchResponse.json();

            if (fetchResponse.status === 403) {
                setErrorMessage(dataFormatted.message)
                return
            }

            setErrorMessage('');
            setSuccesMessage(dataFormatted.message);
            setDependencyToRefresh(!dependencyToRefresh)
            closeModalAnswer();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchResponse = await fetch(urlGetData, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    }
                })
                const formatData = await fetchResponse.json();
                if (fetchResponse.status === 403) {
                    console.log('error: ', formatData.message)
                }
                setStatusRequest(formatData.queryResponse);
            } catch (error) {
                console.log(error.message)
            }
        }


        fetchData()
    }, [authData.token, initialData, dependencyToRefresh])

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

                    <form className="answer__modal__footer">
                        <div>
                            <label htmlFor="sr_fk" className="input__form__div__label">Respuesta:</label>
                            <select name="sr_fk" onChange={(e) => handleChange(e)} className="input__form__div__input">
                                <option value="">Selecciona una respuesta</option>
                                {statusRequest.map((status) => (
                                    <option value={status.id_sr}>{status.name_sr}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description_lrr" className="input__form__div__label">Inserte una descripcion:</label>
                            <input placeholder="Inserte una descripcion" onChange={(e) => handleChange(e)} name="description_lrr" className="input__form__div__input" />

                        </div>


                        <div className="answer__modal__buttons">
                            <ButtonRed
                                title={"Salir"}
                                onClick={closeModalAnswer}
                            />
                            <ButtonBlue
                                onClick={(e) => handleSubmit(e)}
                                title={"Guardar Respuesta"}
                            />
                        </div>

                        {errorMessage.length > 0 && <p className="error-message">{errorMessage}</p>}
                        {successMessage.length > 0 && <p className="success-message">{successMessage}</p>}
                    </form>
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

export default ModalAnswer;