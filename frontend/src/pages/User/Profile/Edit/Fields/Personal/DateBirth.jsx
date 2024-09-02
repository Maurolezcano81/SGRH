

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const DateBirth = ({ entity, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const urlDocuments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT}`
    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_DATE}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_entity: entity.id_entity,
            date_birth_entity: formatDateYear(entity.date_birth_entity)
        });

        console.log(initialData);
        setSingleModalIsOpen(true);
    };

    const handleSingleCloseModal = () => {
        setSingleModalIsOpen(false);
    };

    const formatDateYear = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div className="input__form__div">

                <div className="input__form__div__container">
                    <p className="input__form__div__label">Fecha de nacimiento: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>

                <p className="input__form__div__input">{formatDateYear(entity.date_birth_entity)}</p>

            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'date_birth_entity',
                        placeholder: 'Ingresa la fecha de nacimiento',
                        type: 'date'
                    }
                    }
                    labelText="Ingresa la fecha de nacimiento: "
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default DateBirth