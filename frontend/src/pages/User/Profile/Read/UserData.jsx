import ProfileUserUpdate from "../Edit/Fields/User/ProfileUserUpdate";
import Username from "../Edit/Fields/User/Username";

const UserData = ({ userData, updateProfile, permissionsData,
    isEditMode }) => {
    const user = userData?.user?.["0"];
    const contacts = Object.values(userData?.contacts || {});
    const profile = userData?.profile?.["0"];

    if (!user) {
        return <div>No hay datos de usuario disponibles.</div>;
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

            <Username
                user={user}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            {contacts.map((contact, index) => (
                <div key={index} className="input__form__div">
                    <p className="input__form__div__label">{contact.name_document}: </p>
                    <p className="input__form__div__input">{contact.value_ed}</p>
                </div>
            ))}

            <ProfileUserUpdate
                user={user}
                profile={profile}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <div className="input__form__div">
                <p className="input__form__div__label">Cuenta creada en: </p>
                <p className="input__form__div__input">{formatDate(user.created_at)}</p>
            </div>
        </div>
    );
}

export default UserData;
