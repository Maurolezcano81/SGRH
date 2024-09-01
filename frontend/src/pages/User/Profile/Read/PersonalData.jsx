import Edit from '../../../../assets/Icons/Preferences/Edit.png';

const PersonalData = ({ personalData }) => {
    const entity = personalData?.entity?.["0"]; 
    const documents = Object.values(personalData?.documents || {});

    if (!entity) {
        return <div>Error: No hay datos personales disponibles.</div>;
    }


        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = date.getUTCDate().toString().padStart(2, '0');
          const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); 
          const year = date.getUTCFullYear();
          return `${day}/${month}/${year}`;
        };

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Datos Personales</h2>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Nombre Completo: </p>
                <p className="input__form__div__input">{entity.name_entity}</p>
            </div>

            {documents.map((document, index) => (
                <div key={index} className="input__form__div">
                    <p className="input__form__div__label">{document.name_document}: </p>
                    <p className="input__form__div__input">{document.value_ed}</p>
                </div>
            ))}

            <div className="input__form__div">
                <p className="input__form__div__label">Nacionalidad: </p>
                <p className="input__form__div__input">{entity.name_nacionality}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Sexo: </p>
                <p className="input__form__div__input">{entity.name_sex}</p>
            </div>
            <div className="input__form__div">
                <p className="input__form__div__label">Edad: </p>
                <p className="input__form__div__input">{entity.edad}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Fecha de nacimiento: </p>
                <p className="input__form__div__input">{formatDate(entity.date_birth_entity)}</p>
            </div>
        </div>
    );
}

export default PersonalData;
