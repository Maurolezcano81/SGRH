import React, { useState, useEffect } from "react";
import ButtonBlue from "../../../components/ButtonBlue";
import { useNavigate } from "react-router-dom";

const PerformanceCards = ({
    authData,
    formatDate
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_LAST_PERFORMANCE_QUIZ_PERSONAL}`;

    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const response = await fetch(getAllUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            if (!response.ok) {
                throw new Error("Hubo un error al cargar los datos");
            }

            const result = await response.json();
            setData(result.queryResponse);
        } catch (error) {
            setError("No hay datos disponibles");
        } finally {
            setLoading(false);
        }
    };

    console.log(data)

    useEffect(() => {
        fetchData();
    }, []); 

    if (loading) {
        return <div className="cards__dashboard__container">Cargando...</div>;
    }

    if (error) {
        return <div className="cards__dashboard__container">{error}</div>;
    }

    if (data.length === 0) {
        return <div className="cards__dashboard__container">No hay datos disponibles</div>;
    }


    const navigateToSQ = () =>{
        navigate("/personal/rendimiento/ver")
    }

    return (
        <div className="cards__dashboard__container">
            {data.map((item, index) => (
                <div key={index} className="card__personal__dashboard">
                    <div className="card__personal__dashboard-header">
                        <div className="card__personal__dashboard__container__img">
                            Evaluador:
                            <img
                                src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${item.avatar_user}`}
                                alt="avatar"
                                className="avatar"
                            />
                        </div>

                        <div className="card__personal__dashboard-header-text">
                            <div>{item.name_entity} {item.lastname_entity}</div>
                        </div>
                    </div>

                    <div>
                        <div>{item.name_ep}</div>
                    </div>


                    <div className="card__personal__dashboard-body">
                        <div><strong>Evaluado el:</strong> {formatDate(item.date_complete)}</div>
                        <div><strong>Puntuación:</strong> {Number(item.average).toFixed(2)}</div>

                        <div className="card__buttons">
                            <ButtonBlue
                                title={"Ver Cuestionarios"}
                                onClick={navigateToSQ}
                            />
                        </div>
                    </div>



                </div>
            ))}
        </div>
    );
};

export default PerformanceCards;
