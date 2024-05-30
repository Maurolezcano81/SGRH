import jsonwebtoken, { decode } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export const createToken = (data) => {
  const token = jsonwebtoken.sign(data, process.env.JSON_SECRET);
  return token;
};

export const decodeToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(403).json({
        message: 'Primero debe iniciar sesión',
      });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(403).json({
        message: 'Primero debe iniciar sesión',
      });
    }
  
    try {
      const decoded = jsonwebtoken.decode(token);
  
      const { userId, name_profile } = decoded;
  
      if (name_profile !== 'Administrador') {
        return res.status(403).json({
          message: 'No tienes los permisos para realizar esta acción',
        });
      }
  
      req.userId = userId;
      req.name_profile = name_profile;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'No tienes los permisos para realizar esta accion, por favor inicia sesion nuevamente',
      });
    }
  };

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(403).json({
        message: 'Primero debe iniciar sesión',
      });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(403).json({
        message: 'Primero debe iniciar sesión',
      });
    }
  
    try {
      const verified = jsonwebtoken.verify(token, process.env.JSON_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'No tienes los permisos para realizar esta accion, por favor inicia sesion nuevamente',
      });
    }
  };

export const encryptPwd = (pwd) => {
  try {
    const hashedPwd = bcryptjs.hash(pwd, 10);
    return hashedPwd;
  } catch (error) {
    console.error('Error al hashear pwd' + error.name);
  }
};

export const comparePwd = (pwd, pwdHashed) => {
  try {
    console.log('asd');
  } catch (error) {
    console.error();
  }
};
