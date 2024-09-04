

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const Username = ({ user, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_USER_USERNAME}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_user: user.id_user,
            username_user: user.username_user
        });
        setSingleModalIsOpen(true);
    };

    const handleSingleCloseModal = () => {
        setSingleModalIsOpen(false);
    };

    return (
        <>
            <div className="input__form__div">
                <div className="input__form__div__container">
                    <p className="input__form__div__label">Nombre de usuario: </p>
                    {(isEditMode && (permissionsData?.isRrhh || permissionsData?.isAdmin)) ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
                </div>
                <p className="input__form__div__input">{user.username_user}</p>
            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'username_user',
                        placeholder: 'Ingrese el nombre de usuario'
                    }
                    }
                    labelText="Ingrese el nombre de usuario"
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default Username