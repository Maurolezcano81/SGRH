import DateEntry from "../Edit/Fields/Employee/DateEntry";
import FileEmp from "../Edit/Fields/Employee/FileEmp";
import OccupationUpdate from "../Edit/Fields/Employee/OccupationUpdate.jsx";
import DepartmentUpdate from "../Edit/Fields/Employee/DepartmentUpdate.jsx";
import ButtonRed from "../../../../components/ButtonRed.jsx";
import ButtonEditable from "../../../../components/Buttons/ButtonEditable.jsx";
import { useState } from "react";
import ModalDelete from "../../../../components/Modals/ModalDelete.jsx";
import TerminationModal from "./TerminationModal.jsx";
import ReEnterModal from "./ReEnterModal.jsx";

const EmployeeData = ({ employeeData, updateProfile, permissionsData,
    isEditMode, termination }) => {
    const occupation = employeeData?.occupation?.["0"];
    const department = employeeData?.department?.["0"];
    const employee = employeeData?.employee?.["0"];

    if (!employee) {
        return <div>No hay datos de empleado disponibles.</div>;
    }


    const formatDateYear = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${year}-${month}-${day}`;
    };


    const [isDismissOpen, setIsDismissOpen] = useState(false);
    const [employeeToLeave, setEmployeeToLeave] = useState(null);
    const [lastTerminationId, setLastTerminationId] = useState(null);

    const handleIsDismissOpen = () => {
        setEmployeeToLeave(employee.id_employee)
        setIsDismissOpen(true)
    }


    const handleIsDismissClose = () => {
        setIsDismissOpen(false);
        updateProfile()
    }


    const [isReEnterOpen, setIsReEnterOpen] = useState(false);
    const [employeeToReEnter, setEmployeeToReEnter] = useState(null);

    const handleReEnterOpen = () => {
        setLastTerminationId(termination.id_te);
        setEmployeeToReEnter(employee.id_employee)
        setIsReEnterOpen(true)
    }

    const handleReEnterClose = () => {
        setIsReEnterOpen(false)
        updateProfile()
    }

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Información de Trabajo</h2>
            </div>

            <FileEmp
                employee={employee}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <DateEntry
                employee={employee}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <div className="input__form__div">
                <p className="input__form__div__label">Antiguedad:  </p>
                <p className="input__form__div__input">{employee.antiguedad} años</p>
            </div>

            <OccupationUpdate
                occupation={occupation}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />


            <DepartmentUpdate
                department={department}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <div className="input__form__div">
                <p className="input__form__div__label">Estado del empleado: </p>
                <p className="input__form__div__input">{employee.name_tse}</p>
            </div>

            {termination && (
                <div className="input__form__div">
                    <p className="input__form__div__label color-red">Motivo de baja: </p>
                    <p className="input__form__div__input color-red">{termination.description_tot}</p>
                </div>
            )}


            {termination && (
                <div className="input__form__div">
                    <p className="input__form__div__label color-red">Fecha de baja: </p>
                    <p className="input__form__div__input color-red">{formatDateYear(termination.date_te)}</p>
                </div>
            )}

            {(permissionsData.isAdmin || permissionsData.isRrhh) && !permissionsData.isTheSameUser ?

                <div>
                    {employee.status_employee === 1 && (
                        <ButtonEditable
                            title={"Dar de Baja al Empleado"}
                            color={"red w-full"}
                            onClick={() => handleIsDismissOpen()}
                        />
                    )}

                    {employee.status_employee === 0 && (
                        <ButtonEditable
                            title={"Reingresar al empleado"}
                            color={"blue w-full"}
                            onClick={() => handleReEnterOpen()}
                        />
                    )}

                </div>
                :
                null
            }


            {isDismissOpen && (
                <TerminationModal
                    backButtonAction={handleIsDismissClose}
                    idEmployee={employeeToLeave}
                    onSubmitDeleteAction={handleIsDismissClose}
                    messageToDelete={"¿Quieres dar de baja al empleado? Al aceptar este perdera el acceso al sistema"}
                    textButtonRed={"Dar de Baja"}
                    updateProfile={updateProfile}
                />
            )}


            {isReEnterOpen && (
                <ReEnterModal
                    backButtonAction={handleReEnterClose}
                    idEmployee={employeeToReEnter}
                    onSubmitDeleteAction={handleReEnterClose}
                    messageToDelete={"¿Quieres reingresar este empleado al al sistema?, al aceptar este volvera a tener acceso al sistema"}
                    textButtonRed={"Reingresar"}
                    updateProfile={updateProfile}
                    lastTerminationId={lastTerminationId}
                />
            )}
        </div>
    );
}

export default EmployeeData;
