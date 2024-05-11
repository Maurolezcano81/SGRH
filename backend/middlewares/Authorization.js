import jsonwebtoken, { decode } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';



export const createToken = (data) =>{
    const token = jsonwebtoken.sign(data, process.env.JSON_SECRET)
    return token;
}

export const decodeToken = (req, res, next) =>{
    const { token } = req.body;

    const {userId, name_profile} = jsonwebtoken.decode(token)

    req.userId = userId;
    req.name_profile = name_profile;
    next();
}

export const verifyToken = (req, res, next) =>{
    const { token } = req.body;

    if(!token){
        return res.status(403).json({
            message: "Primero debe iniciar sesión"
        })
    }

    if(!jsonwebtoken.verify(token, process.env.JSON_SECRET)){
        return res.status(403).json({
            message: "Primero debe iniciar sesión"
        })
    }

    next();
};

export const encryptPwd = (pwd) =>{
    try {
        const hashedPwd = bcryptjs.hash(pwd, 10);
        return hashedPwd;        
    } catch (error) {
        console.error("Error al hashear pwd" + error.name);
    }
    
}

export const comparePwd = (pwd, pwdHashed) =>{
    try {
        console.log('asd');
    } catch (error) {
        console.error()
    }
}