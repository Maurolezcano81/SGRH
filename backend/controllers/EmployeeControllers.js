import Employee from "../models/Employee.js";
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const employeeInstance = new Employee();
export const createEmployee = async(req, res) =>{
    const {file, date_entry, idEntity} = req;
    try {
        console.log(`Empleado REQ: ${req.body}`);
        if(isInputEmpty(file) || isInputEmpty(date_entry) || isInputEmpty(idEntity)){
            return res.status(403).json({
                message: "Debes completar todos los campos"
            })
        }

        if(isNotDate(date_entry)){
            return res.status(403).json({
                message: "Debe introducir una fecha valida para la fecha de entrada del personal"
            })
        }

        const queryResponse = await employeeInstance.createEmployee(file, date_entry, idEntity);

        if(!queryResponse){
            return res.status(403).json({
                message: "Ocurrio un error al crear los datos del personal"
            })
        };

        return queryResponse;
    } catch (error) {
        console.error("Error en controlador de empleado: "+error);
    }
}
