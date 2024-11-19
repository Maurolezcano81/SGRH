import React, { useState, useEffect } from "react";
import ButtonBlue from "../../../components/ButtonBlue";
import { useNavigate } from "react-router-dom";

const CapacitationCards = ({
    authData,
    formatDate
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_THREE_LAST_CAPACITATION_PERSONAL}`;

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

    useEffect(() => {
        fetchData();
    }, []); // Se ejecuta solo una vez cuando el componente se monta

    // Manejamos los diferentes estados del componente
    if (loading) {
        return <div className="cards__dashboard__container">Cargando...</div>;
    }

    if (error) {
        return <div className="cards__dashboard__container">{error}</div>;
    }

    if (data.length === 0) {
        return <div className="cards__dashboard__container">No hay datos disponibles</div>;
    }


    const navigateToSQ = () => {
        navigate("/personal/solicitud/capacitacion")
    }

    return (
        <div className="cards__dashboard__container">
            {data.map((item, index) => (
                <div key={index} className="card__personal__dashboard">
                    <div className="card__personal__dashboard-header">
                        Solicitante:

                        <div className="card__personal__dashboard__container__img">
                            <img
                                src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${item.avatar_user}`}
                                alt="avatar"
                                className="avatar"
                            />
                        </div>

                        <div className="card__personal__dashboard-header-text">
                            <div>{authData.name_entity} {authData.lastname_entity}</div>
                        </div>
                    </div>

                    <div>
                        <div>{item.title_rc}</div>
                    </div>


                    <div className="card__personal__dashboard-body">
                        <div><strong>Solicitado el:</strong> {formatDate(item.date_requested)}</div>
                        <div><strong>Respondido el:</strong> {formatDate(item.answered_at)}</div>
                        <div><strong>Respondido por:</strong> {item.author_name} {item.author_lastname}</div>
                        <div><strong>Respuesta:</strong> {item.name_sr}</div>

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

export default CapacitationCards;
