
const PersonalData = ({ occupation_data, department_data,entity_data }) => {

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Datos Personales</h2>
            </div>


            <div className="input__form__div">
                <p className="input__form__div__label">Nombre Completo: </p>
                <p className="input__form__div__input">{`${entity_data[0]?.name_entity} ${entity_data[0]?.lastname_entity}`}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Documento/Identificación: </p>
                <p className="input__form__div__input">{occupation_data[0]?.name_occupation}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Puesto de trabajo </p>
                <p className="input__form__div__input">{occupation_data[0]?.name_occupation}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Puesto de trabajo </p>
                <p className="input__form__div__input">{occupation_data[0]?.name_occupation}</p>
            </div>
            <div className="input__form__div">
                <p className="input__form__div__label">Departamento</p>
                <p className="input__form__div__input">{department_data[0]?.name_department}</p>
            </div>
        </div>


    )
}

export default PersonalData;