import { useEffect, useState } from "react";
import ButtonRed from "../../../components/ButtonRed";
import useAuth from "../../../hooks/useAuth";


const ModalInfoQuizAnswered = ({
    initialData,
    closeModalAnswer
}) => {


    const { authData } = useAuth();

    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RONE_QUIZ_PERFORMANCE_MODAL}`

    const [data, setData] = useState([]);
    const [answers, setDataAnswers] = useState([]);
    const [header, setHeader] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    },
                    body: JSON.stringify({
                        id_ep: initialData.id_ep,
                        id_evaluated: initialData.evaluated_id,
                        id_supervisor: initialData.supervisor_id
                    })
                })

                const formatData = await fetchResponse.json();

                if (fetchResponse.status === 403) {
                    console.log('error: ', formatData.message)
                }

                setData(formatData.list);
                setDataAnswers(formatData.list.answers);
                setHeader(formatData.list.header);
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchData()
    }, [authData.token, initialData])

    
    return (
        <div className="alert__background__black" onClick={(e) => e.stopPropagation()}>
            <div className="preferences__modal__container">
                <div className="preferences__modal__content">



                    {Object.keys(data).length > 0 && (
                        <>
                            <div className="answer__modal__data">
                                <div className="not__answer__header__profile bold">
                                    <p>{initialData.name_ep}</p>
                                </div>

                                <div className="not__answer__body__description answer__body">
                                    <h3>Datos del cuestionario:</h3>

                                    <div className="not__answer__header__profile">
                                        <p>Cuestionario creado por:</p>
                                        <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${header?.avatar_user}`} alt="" />
                                        <h3 className="div__form__input__label title__modal__answer">{header?.author}</h3>
                                    </div>
                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Fecha de Inicio:</p>
                                        <h3 className="div__form__input__input">{header?.start_ep}</h3>
                                    </div>

                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Fecha de fin:</p>
                                        <h3 className="div__form__input__input">{header?.end_ep}</h3>
                                    </div>

                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Cantidad de Preguntas:</p>
                                        <h3 className="div__form__input__input">{header?.quantity_questions}</h3>
                                    </div>

                                </div>
                            </div>

                            <div className="not__answer__body__description answer__body">
                                <h3>Datos del supervisor del cuestionario:</h3>
                                <div className="not__answer__header__profile">
                                    <p>Nombre Completo:</p>
                                    <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${data?.answered.avatar_user}`} alt="" />
                                    <h3 className="div__form__input__label title__modal__answer">{`${data.answered.name_entity} ${data.answered.lastname_entity}`}</h3>
                                </div>

                                <div className="not__answer__body__item answer__body__item">
                                    <p className="div__form__input__label title__modal__answer">Departamento:</p>
                                    <h3 className="div__form__input__input">{data.answered.name_department}</h3>
                                </div>


                                <div className="not__answer__body__item answer__body__item">
                                    <p className="div__form__input__label title__modal__answer">Respondido:</p>
                                    <h3 className="div__form__input__input">{initialData.date_complete}</h3>
                                </div>

                            </div>

                            <div className="not__answer__body__description answer__body">
                                <h3>Datos del evaluado del cuestionario:</h3>
                                <div className="not__answer__header__profile">
                                    <p>Nombre Completo:</p>
                                    <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${data?.evaluated.avatar_user}`} alt="" />
                                    <h3 className="div__form__input__label title__modal__answer">{`${data.evaluated.name_entity} ${data.evaluated.lastname_entity}`}</h3>
                                </div>

                                <div className="not__answer__body__item answer__body__item">
                                    <p className="div__form__input__label title__modal__answer">Departamento:</p>
                                    <h3 className="div__form__input__input">{data.evaluated.name_department}</h3>
                                </div>

                                <div className="not__answer__body__item answer__body__item">
                                    <p className="div__form__input__label title__modal__answer">Puesto de Trabajo:</p>
                                    <h3 className="div__form__input__input">{data.evaluated.name_occupation}</h3>
                                </div>

                                <div className="not__answer__body__item answer__body__item">
                                    <p className="div__form__input__label title__modal__answer">Promedio General:</p>
                                    <h3 className="div__form__input__input">{initialData.average}</h3>
                                </div>
                            </div>

                            {answers && answers.map((answer, index) => (

                                <div className="not__answer__body__description answer__body">
                                    <div className="not__answer__body__item answer__body__item">
                                        <h3 className="div__form__input__label title__modal__answer">{`Pregunta ${index + 1}`}</h3>
                                    </div>
                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Pregunta</p>
                                        <h3 className="div__form__input__input">{answer.description_epq}</h3>
                                    </div>
                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Parametro minimo</p>
                                        <h3 className="div__form__input__input">{answer.bad_parameter_epq}</h3>
                                    </div>
                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Parametro Maximo</p>
                                        <h3 className="div__form__input__input">{answer.best_parameter_epq}</h3>
                                    </div>

                                    <div className="not__answer__body__item answer__body__item">
                                        <p className="div__form__input__label title__modal__answer">Valoración Númerica</p>
                                        <h3 className="div__form__input__input">{answer.score_dep}</h3>
                                    </div>
                                </div>
                            ))}


                        </>



                    )}




                    <div className="answer__modal__footer">
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

export default ModalInfoQuizAnswered;