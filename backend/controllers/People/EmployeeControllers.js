import BaseModel from "../../models/BaseModel.js";
import { isNotAToZ, isNotDate, isNotNumber, isInputEmpty, isInputWithWhiteSpaces } from "../../middlewares/Validations.js";
import EntityModel from "../../models/People/People/Entity.js";
import EmployeeModel from "../../models/People/Employee.js";


class EmployeeControllers {
    constructor() {
        this.employee = new EmployeeModel();

        this.entityDepartmentOccupation = new BaseModel('entity_department_occupation', 'id_edo');
        this.occupation = new BaseModel('occupation', 'name_occupation');
        this.department = new BaseModel('department', 'name_department');
        this.entity = new EntityModel();

        this.nameFieldId = 'id_employee';
        this.nameFieldToSearch = 'file_employee';

        this.audit = new BaseModel('audit_general', 'id_ag');
    }

    async updateFile(req, res) {
        const { id_employee, file_employee } = req.body;

        try {

            if (isInputEmpty(id_employee) || isNotNumber(id_employee)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(file_employee)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos"
                })
            }

            const checkExistFile = await this.employee.getOne(file_employee, this.nameFieldToSearch);

            if (checkExistFile.length >= 1) {
                return res.status(403).json({
                    message: "El legajo ya existe, por favor introduzca otro."
                })
            }

            const update = await this.employee.updateOne({ file_employee }, [this.nameFieldToSearch, id_employee]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateDateEntry(req, res) {
        const { id_employee, date_entry_employee } = req.body;

        console.log(req.body);

        try {

            if (isInputEmpty(id_employee) || isNotNumber(id_employee)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(date_entry_employee)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos"
                })
            }

            if (isNotDate(date_entry_employee)) {
                return res.status(403).json({
                    message: "Debe introducir una fecha valida"
                })
            }

            const update = await this.employee.updateOne({ date_entry_employee }, [this.nameFieldId, id_employee]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateDateEntry(req, res) {
        const { id_employee, date_entry_employee } = req.body;
        try {

            if (isInputEmpty(id_employee) || isNotNumber(id_employee)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(date_entry_employee)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos"
                })
            }

            if (isNotDate(date_entry_employee)) {
                return res.status(403).json({
                    message: "Debe introducir una fecha valida"
                })
            }

            const update = await this.employee.updateOne({ date_entry_employee }, [this.nameFieldId, id_employee]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateStatus(req, res) {
        const { id_employee, status_employee } = req.body;
        try {

            if (isInputEmpty(id_employee) || isNotNumber(id_employee)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(status_employee) || isNotNumber(status_employee)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos"
                })
            }

            if (status_employee != 1 && status_employee != 0) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            const update = await this.employee.updateOne({ status_employee }, [this.nameFieldId, id_employee]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateOccupation(req, res) {
        const { id_edo, occupation_fk } = req.body;
        try {

            if (isInputEmpty(id_edo) || isNotNumber(id_edo)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(occupation_fk) || isNotNumber(occupation_fk)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            const checkExistOccupation = await this.occupation.getOne(occupation_fk, 'id_occupation');

            if (checkExistOccupation.length < 1) {
                return res.status(403).json({
                    message: "El puestro de trabajo no existe, por favor introduzca otro."
                })
            }

            const update = await this.entityDepartmentOccupation.updateOne({ occupation_fk }, ['id_edo', id_edo]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateDepartment(req, res) {
        const { id_edo, department_fk } = req.body;
        const { id_user } = req
        try {
            if (isInputEmpty(id_edo) || isNotNumber(id_edo)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            if (isInputEmpty(department_fk) || isNotNumber(department_fk)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }

            const checkExistDepartment = await this.department.getOne(department_fk, 'id_department');

            if (checkExistDepartment.length < 1) {
                return res.status(403).json({
                    message: "El departamento no existe, por favor introduzca otro."
                })
            }

            const getDataPrev = await this.employee.getData(id_edo)

            if (getDataPrev.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const update = await this.entityDepartmentOccupation.updateOne({ department_fk }, ['id_edo', id_edo]);

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error con los datos a actualizar, por favor intentelo nuevamente reiniciando el sitio"
                })
            }


            const getDataActual = await this.employee.getData(id_edo)

            if (getDataActual.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const getDataUserAction = await this.entity.getDataByIdUser(id_user);

            if (getDataUserAction.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }


            const updateAudit = await this.audit.createOne({
                table_affected_ag: 'entity_department_occupation',
                id_affected_ag: id_edo,
                action_executed_ag: 'U',
                action_context: 'change_department',
                user_id_ag: JSON.stringify(getDataUserAction[0]),
                prev_data_ag: JSON.stringify(getDataPrev[0]),
                actual_data_ag: JSON.stringify(getDataActual[0])
            })

            return res.status(200).json({
                message: "Actualizado correctamente"
            })

        } catch (error) {
            console.error('Error en controlador de Employee: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }
}

export default EmployeeControllers;