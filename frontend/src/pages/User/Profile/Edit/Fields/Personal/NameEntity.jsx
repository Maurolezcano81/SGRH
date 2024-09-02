

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const NameEntity = ({ entity, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT}`
    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_NAME}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_entity: entity.id_entity,
            name_entity: entity.name_entity
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
                    <p className="input__form__div__label">Nombre: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>

                <p className="input__form__div__input">{entity.name_entity}</p>

            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'name_entity',
                        placeholder: 'Ingrese el nombre'
                    }
                    }
                    labelText="Ingrese el nombre"
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default NameEntity