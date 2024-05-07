import User from '../models/User.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../middlewares/Validations.js';
import { encryptPwd } from '../middlewares/Authorization.js';

const userInstance = new User()

export const createUser = async (req, res) =>{
    const {username, pwd, avatar, idEntity} = req;
    try {

        if(isInputEmpty(username) || isInputEmpty(pwd) || isInputEmpty(avatar) || isInputEmpty(idEntity)){
            return res.status(403).json({
                message: "Debes completar todos los campos"
            })
        }

        if(isNotNumber(idEntity) || isInputWithWhiteSpaces(idEntity)){
            return res.status(403).json({
                message: "Error al crear el usuario"
            })
        }

        if(isInputWithWhiteSpaces(username) || isInputWithWhiteSpaces(avatar) || isInputWithWhiteSpaces(pwd)){
            return res.status(403).json({
                message: "Nombre de usuario, clave y avatar no deben tener espacios en blanco"
            })
        };

        const checkUsernameInDb = await userInstance.getUsername(username);
        console.log(checkUsernameInDb);
        if(username === checkUsernameInDb){
            return res.status(403).json({
                message: "Este nombre de usuario ya esta en uso"
            })
        }

        const pwdHashed = await encryptPwd(pwd);

        const idUser = userInstance.createUser(username, pwdHashed, avatar, idEntity);

        if(!idUser){
            return res.status(403).json({
                message: "Error al crear usuario"
            })
        }

        return idUser;
    } catch (error) {
        console.error("Error al crear usuario; "+error.name);
    }

}
