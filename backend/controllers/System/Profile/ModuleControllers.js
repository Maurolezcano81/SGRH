import Module from '../../../models/Auth/Module.js';
import Profile from '../../../models/Auth/Profile.js';

import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

const instanceModule = new Module();
const instanceProfile = new Profile();

export const getModulesByProfile = async (req, res) => {
  const { id_profile } = req.body;

  try {
    const queryResponse = await instanceModule.getModulesByProfile(id_profile);

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay modulos disponibles',
        queryResponse,
      });
    }
    return res.status(200).json({
      message: 'Listado de modulos obtenido con exito',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getModulesOutProfile = async (req, res) => {
  const { id_profile } = req.body;

  try {
    const queryResponse = await instanceModule.getModulesOutProfile(id_profile);

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay modulos disponibles',
        queryResponse,
      });
    }
    return res.status(200).json({
      message: 'Listado de modulos obtenido con exito',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const bindModuleToProfile = async (req, res) => {
  const { id_module, id_profile } = req.body;
  try {
    if (isInputEmpty(id_module) || isInputEmpty(id_profile)) {
      throw new Error('Debe completar todos los campos');
    }

    const checkExistsModule = await instanceModule.getModule(id_module);

    if (checkExistsModule && checkExistsModule.length < 1) {
      throw new Error('El modulo no existe');
    }

    const checkExistsProfile = await instanceProfile.getProfile(id_profile);

    if (checkExistsProfile && checkExistsProfile.length < 1) {
      throw new Error('El perfil no existe');
    }

    const queryResponse = await instanceModule.bindModuleToProfile(id_module, id_profile);

    if (!queryResponse) {
      throw new Error('Error al asignar el modulo');
    }
    return res.status(200).json({
      message: 'Modulo asignado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const unBindModuleToProfile = async (req, res) => {
  const { id_pm } = req.body;
  try {
    if (isNotNumber(id_pm)) {
      throw new Error('Ha ocurrido un error al desasignar el modulo, intente reiniciando el sitio');
    }

    const queryResponse = await instanceModule.unBindModuleToProfile(id_pm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al desasignar el modulo');
    }
    return res.status(200).json({
      message: 'El modulo ha sido desasignado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
