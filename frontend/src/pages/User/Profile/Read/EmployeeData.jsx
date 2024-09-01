const EmployeeData = ({ employeeData }) => {
    const occupation = employeeData?.occupation?.["0"];
    const department = employeeData?.department?.["0"];
    const employee = employeeData?.employee?.["0"];


    if (!employee) {
        return <div>Error: No hay datos de empleado disponibles.</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Información de Trabajo</h2>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Legajo: </p>
                <p className="input__form__div__input">{employee.file_employee}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Fecha de ingreso: </p>
                <p className="input__form__div__input">{formatDate(employee.date_entry_employee)}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Antiguedad:  </p>
                <p className="input__form__div__input">{employee.antiguedad} años</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Ocupacíon: </p>
                <p className="input__form__div__input">{occupation.name_occupation}</p>
            </div>

            <div className="input__form__div">
                <p className="input__form__div__label">Departamento: </p>
                <p className="input__form__div__input">{department.name_department}</p>
            </div>

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
