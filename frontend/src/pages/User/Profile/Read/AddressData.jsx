const AddressData = ({ addressData }) => {
    const address = addressData?.["0"];

    if (!address) {
        return <div>Error: No hay datos de direccion disponibles.</div>;
    }

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Domicilio</h2>
            </div>
            <div className="input__form__div">
                <p className="input__form__div__label">Dirección: </p>
                <p className="input__form__div__input">{address.description_address}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Ciudad: </p>
                <p className="input__form__div__input">{address.name_city}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Provincia: </p>
                <p className="input__form__div__input">{address.name_state}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">País: </p>
                <p className="input__form__div__input">{address.name_country}</p>
            </div>
        </div>
    );
}

export default AddressData;
