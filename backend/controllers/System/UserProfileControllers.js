import UserProfile from "../../models/System/UserProfile.js";
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber } from '../middlewares/Validations.js';

const userProfileInstance = new UserProfile();

export const assignProfileToUser = async (user_profile) => {
    const { idUser, idProfile } = user_profile;
    try {
        if (isInputEmpty(idUser) || isInputWithWhiteSpaces(idUser) || isNotNumber(idUser) || isInputEmpty(idProfile) || isInputWithWhiteSpaces(idProfile) || isNotNumber(idProfile)) {
            throw new Error("Ha ocurrido un error al asignar los permisos");
        }
        const queryResponse = await userProfileInstance.assignProfileToUser(user_profile);
        if (!queryResponse) {
            throw new Error("Ha ocurrido un error al asignar los permisos");
        }
        return queryResponse;
    } catch (error) {
        console.error("Error en user_profile_controller: " + error.message);
        throw new Error(error.message);
    }
}