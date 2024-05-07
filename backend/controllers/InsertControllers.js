import { createEntity } from './EntityControllers.js';
import { createUser } from './UserControllers.js';
import { assignProfileToUser } from './UserProfileControllers.js';
import { createEmployee } from './EmployeeControllers.js';
export const createPersonalAllData = async (req, res) => {
    const { entity_data, user_data, employee_data, profile_data } = req.body;
    try {

        console.log(entity_data)
        const idEntity = await createEntity(entity_data);

        const employee_data_completed ={
            ...employee_data,
            idEntity
        }
        console.log(employee_data_completed);
        
        const insertEmployee = await createEmployee(employee_data_completed)

        const user_data_completed = {
         ...user_data,
         idEntity   
        }
        console.log(user_data_completed)
        const idUser = await createUser(user_data_completed);

        const user_profile_data = {
            idUser,
            profile_data
        }
        const insertUserProfile = await assignProfileToUser(user_profile_data);

        return res.status(200).json({
            message: "Datos del personal ingresados correctamente"
        });
    } catch (error) {
        console.error("Error en InsertControllers :" + error);
    }
}