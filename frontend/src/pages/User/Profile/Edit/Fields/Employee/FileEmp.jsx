

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const FileEmp = ({ employee, updateProfile, profile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_EMPLOYEE_FILE}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_employee: employee.id_employee,
            file_employee: employee.file_employee
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
                    <p className="input__form__div__label">legajo: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>
                <p className="input__form__div__input">{employee.file_employee}</p>
            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'file_employee',
                        placeholder: 'Ingrese el legajo'
                    }
                    }
                    labelText="Ingrese el legajo"
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default FileEmp