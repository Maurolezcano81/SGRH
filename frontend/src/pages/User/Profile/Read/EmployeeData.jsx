import DateEntry from "../Edit/Fields/Employee/DateEntry";
import FileEmp from "../Edit/Fields/Employee/FileEmp";
import OccupationUpdate from "../Edit/Fields/Employee/OccupationUpdate.jsx";
import DepartmentUpdate from "../Edit/Fields/Employee/DepartmentUpdate.jsx";

const EmployeeData = ({ employeeData, updateProfile, permissionsData,
    isEditMode }) => {
    const occupation = employeeData?.occupation?.["0"];
    const department = employeeData?.department?.["0"];
    const employee = employeeData?.employee?.["0"];

    if (!employee) {
        return <div>Error: No hay datos de empleado disponibles.</div>;
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
                {employee.status_employee && employee.status_employee == 1 && (
                    <p className="input__form__div__input">Activo</p>
                )}
                {employee.status_employee && employee.status_employee == 0 && (
                    <p className="input__form__div__input">De baja</p>
                )}
            </div>

        </div>
    );
}

export default EmployeeData;
