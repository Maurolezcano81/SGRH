import UserCredentials from '../models/UserCredentials.js';
import {isInputEmpty, isInputWithWhiteSpaces} from '../middlewares/Validations.js';
import jsonwebtoken from 'jsonwebtoken';

const UserCredentialsInstance = new UserCredentials();

const createToken = (data) =>{
    const token = jsonwebtoken.sign(data, process.env.JSON_SECRET)
    return token;
}

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

        
        const userData = {
            ...userQueryResult,
            token: createToken(userQueryResult.id_user)
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