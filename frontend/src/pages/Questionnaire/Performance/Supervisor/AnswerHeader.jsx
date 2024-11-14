import useAuth from "../../../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import { useBreadcrumbs } from "../../../../contexts/BreadcrumbsContext";


const AnswerHeader = ({
    ep
}) => {

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        updateBreadcrumbs([
            { name: 'Cuestionarios de Rendimiento', url: '/supervisor/rendimiento' },
            { name: `Evaluar ${ep.name_ep}`, url: '' },
        ]);
    }, [location.pathname]);



    return (

        <div className='container__content quiz'>
            <div className="quiz__header__container">
                <div className="container__content">
                    <div className="quiz__header__section">
                        <div className="quiz__header__title">
                        </div>

                    </div>

                    <div className="quiz__header__section">
                        <h4 className="margin-y-1">{ep.name_ep || ""}</h4>
                        <div className="quiz__header__dates">
                            <div className="quiz__header__date">
                                <p className="quiz__label" >Cantidad de Preguntas:</p>
                                <p className="quiz__label">{ep.quantity_questions}</p>
                            </div>

                            <div className="quiz__header__date">
                                <p className="quiz__label" >Fecha de inicio:</p>
                                <p className="quiz__label">{ep.start_ep}</p>
                            </div>

                            <div className="quiz__header__date">
                                <p className="quiz__label">Fecha de Finalizacion:</p>
                                <p className="quiz__label">{ep.end_ep}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerHeader;