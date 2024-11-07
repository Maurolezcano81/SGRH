import { useState, useEffect } from "react";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ModalLabelSelect from "../../../../../../components/Modals/Updates/ModalLabelSelect";

const OccupationUpdate = ({ occupation, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`
    const urlUpdate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_EMPLOYEE_OCCUPATION}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_edo: occupation.id_edo,
            occupation_fk: occupation.id_occupation
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
                    <p className="input__form__div__label">Puesto de trabajo: </p>
                    {(isEditMode && (permissionsData?.isRrhh || permissionsData?.isAdmin)) ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
                </div>
                <p
                    className="input__form__div__input">
                    {occupation.name_occupation}
                </p>

                {singleModalIsOpen && (
                    <ModalLabelSelect
                        initialData={initialData}
                        handleCloseModal={handleSingleCloseModal}
                        urlForSelect={urlSelect}
                        urlUpdate={urlUpdate}
                        updateProfile={updateProfile}
                        selectField={{
                            name: 'occupation_fk',
                            placeholder: 'Seleccione un puesto de trabajo',
                            optionKey: 'id_occupation',
                            optionValue: 'id_occupation',
                            optionLabel: 'name_occupation'
                        }}
                        labelText={"Puesto de trabajo: "}
                    />
                )}
            </div>
        </>
    )
}


export default OccupationUpdate