

import { useState, useEffect } from "react";
import ModalLabelInput from "../../../../../../components/Modals/Updates/ModalLabelInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const DateEntry = ({ employee, updateProfile }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});


    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_EMPLOYEE_DATE_ENTRY}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_employee: employee.id_employee,
            date_entry_employee: formatDateYear(employee.date_entry_employee)
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
                    <p className="input__form__div__label">Fecha de ingreso: </p>
                    <EditButton
                        handleClick={() => handleSingleEditClick()}
                    />
                </div>

                <p className="input__form__div__input">{formatDateYear(employee.date_entry_employee)}</p>

            </div>

            {singleModalIsOpen && (
                <ModalLabelInput
                    initialData={initialData}
                    handleCloseModal={handleSingleCloseModal}
                    inputField={{
                        name: 'date_entry_employee',
                        placeholder: 'Ingresa la fecha de ingreso',
                        type: 'date'
                    }
                    }
                    labelText="Ingresa la fecha de ingreso: "
                    urlUpdate={update}
                    updateProfile={updateProfile}
                />
            )}
        </>
    )
}


export default DateEntry