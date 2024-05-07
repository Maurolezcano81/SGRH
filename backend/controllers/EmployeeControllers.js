import Employee from "../models/Employee.js";
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const employeeInstance = new Employee();

export const createEmployee = async (employee_data) => {
    const { file, date_entry, idEntity } = employee_data;
    try {
        if (isInputEmpty(file) || isInputEmpty(date_entry) || isInputEmpty(idEntity)) {
            throw new Error("Debes completar todos los campos");
        }

        if (isNotDate(date_entry)) {
            throw new Error("Debe introducir una fecha válida para la fecha de entrada del personal");
        }

        const queryResponse = await employeeInstance.createEmployee(file, date_entry, idEntity);

        if (!queryResponse) {
            throw new Error("Ocurrió un error al crear los datos del personal");
        }

        return queryResponse;
    } catch (error) {
        console.error("Error en controlador de empleado: " + error.message);
        throw new Error(error.message);
    }
};