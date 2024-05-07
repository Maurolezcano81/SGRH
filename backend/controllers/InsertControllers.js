import { createEntity } from './EntityControllers.js';
import { createUser } from './UserControllers.js';
import { assignProfileToUser } from './UserProfileControllers.js';
import { createEmployee } from './EmployeeControllers.js';

export const createPersonalAllData = async (req, res) => {
    const { entity_data, user_data, employee_data, profile_data } = req.body;
    try {
        
        const idEntity = await createEntity(entity_data);

        const employee_data_completed ={
            ...employee_data,
            idEntity
        }
        
        const insertEmployee = await createEmployee(employee_data_completed)

        const user_data_completed = {
         ...user_data,
         idEntity: idEntity
        }
        const idUser = await createUser(user_data_completed);

        const user_profile_data = {
            idUser,
            idProfile: profile_data
        }

        const insertUserProfile = await assignProfileToUser(user_profile_data);
        return res.status(200).json({
            message: "Datos del personal ingresados correctamente"
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message
        })
    }
}