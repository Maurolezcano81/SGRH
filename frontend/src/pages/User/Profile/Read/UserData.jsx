const UserData = ({ userData }) => {
    const user = userData?.user?.["0"];
    const contacts = Object.values(userData?.contacts || {});
    const profile = userData?.profile?.["0"];


    if (!user) {
        return <div>Error: No hay datos de usuario disponibles.</div>;
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
                <h2>Usuario</h2>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Nombre de usuario: </p>
                <p className="input__form__div__input">{user.username_user}</p>
            </div>

            {contacts.map((contact, index) => (
                <div key={index} className="input__form__div">
                    <p className="input__form__div__label">{contact.name_document}: </p>
                    <p className="input__form__div__input">{contact.value_ed}</p>
                </div>
            ))}

            <div className="input__form__div">
                <p className="input__form__div__label">Tipo de perfil: </p>
                <p className="input__form__div__input">{profile.name_profile}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Cuenta creada en: </p>
                <p className="input__form__div__input">{formatDate(user.created_at)}</p>
            </div>
        </div>
    );
}

export default UserData;
