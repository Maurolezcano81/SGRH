import UserCredentials from '../models/Auth/UserCredentials.js';
import {isInputEmpty, isInputWithWhiteSpaces} from '../middlewares/Validations.js';
import jsonwebtoken from 'jsonwebtoken';
import { comparePwd, createToken } from '../middlewares/Authorization.js';

const UserCredentialsInstance = new UserCredentials();


const getUser = async (req,res) =>{
    try{
        const { username, pwd } = req.body;
        
        if(isInputEmpty(username)){
            return res.status(403).json({message: "Debes ingresar un nombre de usuario"}) 
        };

        if(isInputEmpty(pwd)){
            return res.status(403).json({message: "Debes ingresar una clave"}) 
        };

        if(isInputWithWhiteSpaces(pwd)){
            return res.status(403).json({
                message: "La clave no puede contener espacios en blanco"
            })
        }

        const userQueryResult = await UserCredentialsInstance.getUser(username, pwd);

        if(!userQueryResult){
            return res.status(403).json({
                message: "Usuario no encontrado o contraseña incorrecta"
            }) 
        }

        const dataToToken = {
            userId: userQueryResult.id_user,
            name_profile: userQueryResult.name_profile
        }
        
        const userData = {
            ...userQueryResult,
            token: createToken(dataToToken)
        }
        delete userData.id_user;


        return res.status(200).json({
            message:"Autenticación exitosa",
            userData
        })
    } catch(e){
        return console.error(e + "\n Error en el controlador de UserCredentials");
    }
}

const UserCredentialsControllers = {
    getUser
}

export default UserCredentialsControllers;