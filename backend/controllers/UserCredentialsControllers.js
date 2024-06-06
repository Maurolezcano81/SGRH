import UserCredentials from '../models/Auth/UserCredentials.js';
import { isInputEmpty, isInputWithWhiteSpaces } from '../middlewares/Validations.js';
import { createToken, comparePwd } from '../middlewares/Authorization.js';

const UserCredentialsInstance = new UserCredentials();

const getUser = async (req, res) => {
  try {
    const { username, pwd_user } = req.body;

    if (isInputEmpty(username)) {
      return res.status(422).json({ message: 'Debes ingresar un nombre de usuario' });
    }

    if (isInputEmpty(pwd_user)) {
      return res.status(422).json({ message: 'Debes ingresar una clave' });
    }

    if (isInputWithWhiteSpaces(pwd_user)) {
      return res.status(422).json({
        message: 'La clave no puede contener espacios en blanco',
      });
    }

    // Obtener los datos del usuario por su nombre de usuario
    const userQueryResult = await UserCredentialsInstance.getUser(username);

    if (userQueryResult.length < 1) {
      return res.status(401).json({
        message: 'Usuario no encontrado',
      });
    }

    if (username === process.env.admin_user && pwd_user === userQueryResult[0].pwd_user) {
      const userDataLogin = await UserCredentialsInstance.getUserDataLogin(username);

      const dataToToken = {
        userId: userDataLogin.id_user,
        profile_fk: userDataLogin.profile_fk,
      };

      const userData = {
        ...userDataLogin,
        token: createToken(dataToToken),
      };
      delete userData.id_user;

      return res.status(200).json({
        message: 'Autenticación exitosa como superusuario',
        userData,
      });
    }

    const isPwdCorrect = await comparePwd(pwd_user, userQueryResult[0].pwd_user);

    if (!isPwdCorrect) {
      return res.status(401).json({
        message: 'Usuario o contraseña incorrectos',
      });
    }

    const userDataLogin = await UserCredentialsInstance.getUserDataLogin(username);

    const dataToToken = {
      userId: userDataLogin.id_user,
      profile_fk: userDataLogin.profile_fk,
    };

    const userData = {
      ...userDataLogin,
      token: createToken(dataToToken),
    };
    delete userData.id_user;

    return res.status(200).json({
      message: 'Autenticación exitosa',
      userData,
    });
  } catch (error) {
    console.error('Error en el controlador de UserCredentials:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const UserCredentialsControllers = {
  getUser,
};

export default UserCredentialsControllers;
