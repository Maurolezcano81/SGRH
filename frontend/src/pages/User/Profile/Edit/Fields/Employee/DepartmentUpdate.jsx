import { useState, useEffect } from "react";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ModalLabelSelect from "../../../../../../components/Modals/Updates/ModalLabelSelect";

const DepartmentUpdate = ({ department, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`
    const urlUpdate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_EMPLOYEE_DEPARTMENT}`

    const handleSingleEditClick = () => {
        setInitialData({
            id_edo: department.id_edo,
            department_fk: department.id_department
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
                    <p className="input__form__div__label">Departamento: </p>
                    {(isEditMode && (permissionsData?.isRrhh || permissionsData?.isAdmin)) ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
                </div>
                <p
                    className="input__form__div__input">
                    {department.name_department}
                </p>

                {singleModalIsOpen && (
                    <ModalLabelSelect
                        initialData={initialData}
                        handleCloseModal={handleSingleCloseModal}
                        urlForSelect={urlSelect}
                        urlUpdate={urlUpdate}
                        updateProfile={updateProfile}
                        selectField={{
                            name: 'department_fk',
                            placeholder: 'Seleccione un Departamento',
                            optionKey: 'id_department',
                            optionValue: 'id_department',
                            optionLabel: 'name_department'
                        }}
                        labelText={"Departamento: "}
                    />
                )}
            </div>
        </>
    )
}


export default DepartmentUpdate