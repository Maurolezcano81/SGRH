
import TerminationModel from '../../models/Termination/TerminationModel.js';
import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class TerminationEmployee {
    constructor() {
        this.model = new TerminationModel();
        this.nameFieldId = 'id_te';
        this.nameFieldToSearch = 'id_te';

        this.user = new BaseModel('user', 'username_user');
        this.entity = new BaseModel('entity', 'name_entity');
        this.employee = new BaseModel('employee', 'id_employee');
    }


    async createTerminationEmployee(req, res) {

        const { tot_fk, idEmployee } = req.body;

        try {

            const now = new Date()

            const nowData = `${now.getFullYear()}/${now.getMonth()}/${now.getDay()}`

            const create = await this.model.createOne({
                tot_fk: tot_fk,
                employee_fk: idEmployee,
                date_te: nowData
            });

            if (!create && create.affectedRows < 1) {
                return res.status(500).json({
                    message: "No se ha podido dar de baja al empleado, intentelo de nuevo más adelante."
                })
            }

            const getDataToUpdate = await this.model.getUserData(idEmployee);

            if (Object.keys(getDataToUpdate).length < 1) {
                return res.status(500).json({
                    message: "No se ha podido dar de baja al empleado, intentelo de nuevo más adelante."
                })
            }

            const updateUser = await this.user.updateOne({
                status_user: 0
            }, ['id_user', getDataToUpdate.id_user])


            const updateEntity = await this.entity.updateOne({
                status_entity: 0
            }, ['id_entity', getDataToUpdate.id_entity]);

            const updateEmployee = await this.employee.updateOne({
                status_employee: 0,
                tse_fk: 3
            }, ['id_employee', getDataToUpdate.id_employee])

            return res.status(200).json({
                message: "El empleado ha sido dado de baja exitosamente"
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: "Ha occurido un error al dar de baja al empleado, intente reiniciando el sitio"
            })
        }
    }


    async reEnterEmployee(req, res) {
        const { idEmployee, lastTerminationId } = req.body;
        try {

            const checkExistsLastTermination = await this.model.getOne(lastTerminationId, 'id_te');

            if(checkExistsLastTermination.length < 1){
                return res.status(403).json({
                    message: "No se ha podido dar de baja al empleado, intentelo de nuevo más adelante."
                })
            }

            const updateAllTerminationByEmployee = await this.model.UpdateAllTerminationByEmployee(idEmployee, lastTerminationId)

            if(updateAllTerminationByEmployee.affectedRows < 1){
                return res.status(403).json({
                    message: "No se ha podido dar de baja al empleado, intentelo de nuevo más adelante."
                })
            }

            const getDataToUpdate = await this.model.getUserData(idEmployee);

            if (Object.keys(getDataToUpdate).length < 1) {
                return res.status(500).json({
                    message: "No se ha podido dar de baja al empleado, intentelo de nuevo más adelante."
                })
            }

            const updateUser = await this.user.updateOne({
                status_user: 1
            }, ['id_user', getDataToUpdate.id_user])

            const updateEntity = await this.entity.updateOne({
                status_entity: 1
            }, ['id_entity', getDataToUpdate.id_entity]);

            const updateEmployee = await this.employee.updateOne({
                status_employee: 1,
                tse_fk: 1
            }, ['id_employee', getDataToUpdate.id_employee])

            return res.status(200).json({
                message: "El empleado ha sido reingresado exitosamente"
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: "Ha occurido un error al reingresar al empleado, intente reiniciando el sitio"
            })
        }
    }
}

export default TerminationEmployee