import User from '../models/User.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../middlewares/Validations.js';
import { encryptPwd } from '../middlewares/Authorization.js';

const userInstance = new User()

export const createUser = async (user_data) => {
    const { username, pwd, avatar, idEntity } = user_data;
    try {
        if (isInputEmpty(username) || isInputEmpty(pwd) || isInputEmpty(avatar) || isInputEmpty(idEntity)) {
            throw new Error("Debes completar todos los campos");
        }

        if (isNotNumber(idEntity) || isInputWithWhiteSpaces(idEntity)) {
            throw new Error("Error al crear el usuario");
        }

        if (isInputWithWhiteSpaces(username) || isInputWithWhiteSpaces(avatar) || isInputWithWhiteSpaces(pwd)) {
            throw new Error("Nombre de usuario, clave y avatar no deben tener espacios en blanco");
        }

        const checkUsernameInDb = await userInstance.getUsername(username);
        if (checkUsernameInDb === username) {
            throw new Error("Este nombre de usuario ya está en uso");
        }

        const pwdHashed = await encryptPwd(pwd);
        const idUser = await userInstance.createUser(username, pwdHashed, avatar, idEntity);

        if (!idUser) {
            throw new Error("Error al crear usuario");
        }

        return idUser;
    } catch (error) {
        console.error("Error al crear usuario: " + error.message);
        throw new Error(error.message);
    }
};