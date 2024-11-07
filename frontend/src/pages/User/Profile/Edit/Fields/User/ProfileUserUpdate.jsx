
import { useState, useEffect } from "react";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ModalLabelSelect from "../../../../../../components/Modals/Updates/ModalLabelSelect";
import useAuth from "../../../../../../hooks/useAuth";
import useNav from '../../../../../../hooks/useNav';
const ProfileUserUpdate = ({ user, updateProfile, profile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_PROFILE}`
    const urlUpdate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_USER_PROFILE}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_user: user.id_user,
            profile_fk: profile.id_profile
        });
        setSingleModalIsOpen(true);
    };

    const handleSingleCloseModal = (value) => {
        setSingleModalIsOpen(false);
    };

    return (
        <>
            <div className="input__form__div">

                <div className="input__form__div__container">
                    <p className="input__form__div__label">Tipo de Permiso: </p>
                    {(isEditMode && (permissionsData?.isAdmin)) ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
                </div>
                <p
                    className="input__form__div__input">
                    {profile.name_profile}
                </p>

                {singleModalIsOpen && (
                    <ModalLabelSelect
                        initialData={initialData}
                        handleCloseModal={handleSingleCloseModal}
                        urlForSelect={urlSelect}
                        urlUpdate={urlUpdate}
                        updateProfile={updateProfile}
                        selectField={{
                            name: 'profile_fk',
                            placeholder: 'Seleccione un permiso',
                            optionKey: 'id_profile',
                            optionValue: 'id_profile',
                            optionLabel: 'name_profile'
                        }}
                        labelText={"Tipo de Permiso: "}
                    />
                )}
            </div>
        </>
    )
}


export default ProfileUserUpdate