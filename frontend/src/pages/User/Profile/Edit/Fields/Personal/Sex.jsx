
import { useState, useEffect } from "react";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ModalLabelSelect from "../../../../../../components/Modals/Updates/ModalLabelSelect";

const Sex = ({ entity, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_SEX}`
    const urlUpdate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_SEX}`


    const handleSingleEditClick = () => {
        setInitialData({
            id_entity: entity.id_entity,
            sex_fk: entity.sex_fk
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
                    <p className="input__form__div__label">Sexo: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>
                <p
                    className="input__form__div__input">
                    {entity.name_sex}
                </p>

                {singleModalIsOpen && (
                    <ModalLabelSelect
                        initialData={initialData}
                        handleCloseModal={handleSingleCloseModal}
                        urlForSelect={urlSelect}
                        urlUpdate={urlUpdate}
                        updateProfile={updateProfile}
                        selectField={{
                            name: 'sex_fk',
                            placeholder: 'Seleccione un sexo',
                            optionKey: 'id_sex',
                            optionValue: 'id_sex',
                            optionLabel: 'name_sex'
                        }}
                        labelText={"Sexo: "}
                    />
                )}
            </div>
        </>
    )
}


export default Sex