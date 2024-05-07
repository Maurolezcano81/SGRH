import UserProfile from "../models/UserProfile.js";
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber } from '../middlewares/Validations.js';

const userProfileInstance = new UserProfile();

export const assignProfileToUser = (req, res) => {
    const { idUser, idProfile } = req;

    try {
        if (isInputEmpty(idUser) || isInputWithWhiteSpaces(idUser) || isNotNumber(idUser) || isInputEmpty(idProfile) || isInputWithWhiteSpaces(idProfile) || isNotNumber(idProfile)) {
            return res.status(403).json({
                message: "Ha ocurrido un error al asignar los permisos"
            });
        }
    
        const queryResponse = userProfileInstance.assignProfileToUser(idUser, idProfile);
    
        if (!queryResponse) {
            return res.status(403).json({
                message: "Ha ocurrido un error al asignar los permisos"
            })
        }
    
        return queryResponse;
    } catch (error) {
        console.error("Error en user_profile_controller: "+error);
    }
}
