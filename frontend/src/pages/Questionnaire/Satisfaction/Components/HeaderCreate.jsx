import PreferenceTitle from "../../../MasterTables/PreferenceTitle";

const HeaderCreate = () => {


    return (
        <>
            <PreferenceTitle title={"Creacion de cuestionario de Satisfaccion"} />

            <div className="quiz__container">
                <div className="quiz__header__container">
                    <div className="quiz__header__section">
                        <div className="quiz__header__title">
                            <label className="quiz__label quiz__title" htmlFor="name_sq">Titulo del cuestionario:</label>
                            <input className="quiz__input" name="name_sq" type="text" />
                        </div>

                    </div>

                    <div className="quiz__header__section">
                        <h4>Configuracion de Fechas</h4>
                        <div className="quiz__header__dates">
                            <div className="quiz__header__date">
                                <label className="quiz__label" htmlFor="start_sc">Fecha de inicio:</label>
                                <input className="quiz__input" name="start_sc" type="date" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default HeaderCreate;