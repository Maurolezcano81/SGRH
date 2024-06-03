import Profile from '../../models/Auth/Profile.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceProfile = new Profile();

export const getProfiles = async (req, res) => {
  try {
    const queryResponse = await instanceProfile.getProfiles();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de perfil disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de perfil obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const { value_profile } = req.body;
  try {
    if (isInputEmpty(value_profile)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de perfil son invalidos');
    }

    const queryResponse = await instanceProfile.getProfile(value_profile);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el perfil');
    }

    return res.status(200).json({
      message: 'Tipo de perfil obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createProfile = async (req, res) => {
  const { name_profile } = req.body;
  try {
    if (isInputEmpty(name_profile)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_profile)) {
      throw new Error('El perfil no debe contener caracteres especiales');
    }

    const checkExists = await instanceProfile.getProfile(name_profile);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de perfil ya existente');
    }

    const queryResponse = await instanceProfile.createProfile(name_profile);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de perfil');
    }

    return res.status(200).json({
      message: 'Tipo de perfil creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { id_profile, name_profile, status_profile } = req.body;
  try {
    if (isInputEmpty(name_profile)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_profile)) {
      throw new Error('El tipo de perfil no debe contener caracteres especiales');
    }

    if (isNotNumber(id_profile)) {
      throw new Error('Los datos del tipo de perfil son invalidos');
    }

    if (isNotNumber(status_profile)) {
      throw new Error('Los datos de estado del tipo de perfil son invalidos');
    }

    const checkExists = await instanceProfile.getProfile(id_profile);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de perfil, debido a que no existe');
    }

    const queryResponse = await instanceProfile.updateProfile(id_profile, name_profile, status_profile);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del perfil');
    }

    return res.status(200).json({
      message: 'Tipo de perfil actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusProfile = async (req, res) => {
  const { id_profile, status_profile } = req.body;

  try {
    if (isNotNumber(id_profile)) throw new Error('Los datos del tipo de perfil son invalidos');

    const checkExists = await instanceProfile.getProfile(id_profile);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de perfil, debido a que no existe');
    }

    const queryResponse = await instanceProfile.toggleStatusProfile(id_profile, status_profile);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de perfil');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  const { value_profile } = req.body;
  try {
    if (isNotNumber(value_profile)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de perfil, intente reiniciando el sitio');
    }

    const queryResponse = await instanceProfile.deleteProfile(value_profile);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de perfil');
    }

    return res.status(200).json({
      message: 'Tipo de perfil eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de perfil: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
