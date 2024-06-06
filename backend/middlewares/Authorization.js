import jsonwebtoken, { decode } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export const createToken = (data) => {
  const token = jsonwebtoken.sign(data, process.env.JSON_SECRET);
  return token;
};

export const decodeTokenForAdministrator = (req, res, next) => {
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

    const { userId, profile_fk } = decoded;

    if (profile_fk != 1) {
      return res.status(403).json({
        message: 'No tienes los permisos para realizar esta acción',
      });
    }

    req.id_user = userId;
    req.profile_fk = profile_fk;
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'No tienes los permisos para realizar esta accion, por favor inicia sesion nuevamente',
    });
  }
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

    const { userId, profile_fk } = decoded;

    req.id_user = userId;
    req.profile_fk = profile_fk;
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

export const encryptPwd = async (pwd) => {
  try {
    const hashedPwd = await bcryptjs.hash(pwd, 10);
    return hashedPwd;
  } catch (error) {
    console.error('Error al hashear pwd: ' + error.message);
    throw new Error('Error al hashear la contraseña');
  }
};

export const comparePwd = async (plainTextPassword, hashedPassword) => {
  try {
    const result = await bcryptjs.compare(plainTextPassword, hashedPassword);
    console.log(plainTextPassword);
    console.log(hashedPassword);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error comparando contraseñas:', error);
    throw new Error('Error al comparar contraseñas');
  }
};