
import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import ButtonBlue from "../../../../components/ButtonBlue";
import { Navigate, useNavigate } from "react-router-dom";

const LastFive = () => {
    const [data, setData] = useState([]);

    const urlGetData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTIONS_EMPLOYEE_NOT_ANSWER}`
    const { authData } = useAuth()
    const navigate = useNavigate();

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
                setData(formatData.list);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchData()
    }, [authData.token])

    const redirectToAnswerPage = (item) => {
        console.log(item);
        navigate('/personal/satisfaccion/responder', { state: { sq: item } })
    }

    return (
        <div className="container__content">
            <h2>Ultimas 5 sin responder</h2>

            <div className="not__answer__container">
                {data && data.map((item, index) => (
                    <div className="not__answer__item" key={index}>

                        <div className="not__answer__header">
                            <div className="not__answer__header__profile">
                                <p className="bold">{item.name_sq}</p>
                            </div>
                        </div>

                        <div className="not__answer__body__description">
                            <p className="color-black">{`Fecha de Inicio: ${item.start_sq}`}</p>
                            <p className="color-black">{`Fecha de Fin: ${item.end_sq}`}</p>
                            <p className="color-black">{`Cantidad de Preguntas: ${item.quantity_questions}`}</p>

                        </div>

                        <div className="not__answer__footer">
                            <ButtonBlue
                                onClick={() => redirectToAnswerPage(item)}
                                title={"Responder"}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}


export default LastFive;