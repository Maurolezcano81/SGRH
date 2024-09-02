

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const LastNameEntity = ({ entity, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const urlDocuments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT}`
    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_LASTNAME}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_entity: entity.id_entity,
            lastname_entity: entity.lastname_entity
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
                    <p className="input__form__div__label">Apellido: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>

                <p className="input__form__div__input">{entity.lastname_entity}</p>

            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'lastname_entity',
                        placeholder: 'Ingrese el apellido'
                    }
                    }
                    labelText="Ingrese el apellido"
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default LastNameEntity