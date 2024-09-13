import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import ButtonBlue from "../../../components/ButtonBlue";
import ModalAnswer from "./ModalAnswer";


const TableCapacitations = ({
    dependencyToRefresh,
    setDependencyToRefresh
}) => {
    const [data, setData] = useState([]);
    const [initialDataToAnswer, setInitialDataToAnswer] = useState(null);
    const [isModalAnswerOpen, setIsModalAnswerOpen] = useState(false);

    const urlGetData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CAPACITATION_NOT_ANSWER_RRHH}`
    const { authData } = useAuth()


    const openModalAnswer = (initialData) => {
        setInitialDataToAnswer(initialData)
        setIsModalAnswerOpen(true)
    }


    const closeModalAnswer = () => {
        setIsModalAnswerOpen(false);
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchResponse = await fetch(urlGetData, {
                    method: 'POST',
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
    }, [authData.token, dependencyToRefresh])

    return (
        <div className="container__content">
            <h2>Ultimas 5 sin responder</h2>

            <div className="not__answer__container">
                {data && data.map((request, index) => (
                    <div className="not__answer__item" key={index}>

                        <div className="not__answer__header">
                            <div className="not__answer__header__profile">
                                <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${request.avatar_user}`} alt="" />
                                <p>{request.requestor_name}</p>
                            </div>
                        </div>

                        <div className="not__answer__body__description">
                            <p>{`${request.description_rc}`}</p>

                        </div>

                        <div className="not__answer__footer">
                            <ButtonBlue
                                onClick={() => openModalAnswer(request)}
                                title={"Responder"}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {isModalAnswerOpen && (
                <ModalAnswer
                    initialData={initialDataToAnswer}
                    closeModalAnswer={closeModalAnswer}
                    setDependencyToRefresh={setDependencyToRefresh}
                />
            )}
        </div>

    )
}


export default TableCapacitations;