
import { useState, useEffect } from "react";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ModalLabelSelect from "../../../../../../components/Modals/Updates/ModalLabelSelect";

const Nacionality = ({ entity, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_NACIONALITY}`
    const urlUpdate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_NACIONALITY}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_entity: entity.id_entity,
            nacionality_fk: entity.id_nacionality
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
                    <p className="input__form__div__label">Nacionalidad: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>
                <p
                    className="input__form__div__input">
                    {entity.name_nacionality}
                </p>

                {singleModalIsOpen && (
                    <ModalLabelSelect
                        initialData={initialData}
                        handleCloseModal={handleSingleCloseModal}
                        urlForSelect={urlSelect}
                        urlUpdate={urlUpdate}
                        updateProfile={updateProfile}
                        selectField={{
                            name: 'nacionality_fk',
                            placeholder: 'Seleccione una nacionalidad',
                            optionKey: 'id_nacionality',
                            optionValue: 'id_nacionality',
                            optionLabel: 'name_nacionality'
                        }}
                        labelText={"Nacionalidad: "}
                    />
                )}
            </div>
        </>
    )
}


export default Nacionality