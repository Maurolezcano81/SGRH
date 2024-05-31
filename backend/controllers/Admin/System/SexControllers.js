import Sex from '../../../models/Admin/System/Sex.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

const instanceSex = new Sex();

export const getSexs = async (req, res) => {
  try {
    const queryResponse = await instanceSex.getSexs();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de sexo disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de sexo obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getSex = async (req, res) => {
  const { value_sex } = req.body;
  try {
    if (isInputEmpty(value_sex)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de sexo son invalidos');
    }
    
    const queryResponse = await instanceSex.getSex(value_sex);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el sexo');
    }

    return res.status(200).json({
      message: 'Tipo de sexo obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createSex = async (req, res) => {
  const { name_sex } = req.body;
  try {
    if (isInputEmpty(name_sex)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_sex)) {
      throw new Error('El sexo no debe contener caracteres especiales');
    }

    const checkExists = await instanceSex.getSex(name_sex);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de sexo ya existente');
    }

    const queryResponse = await instanceSex.createSex(name_sex);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de sexo');
    }

    return res.status(200).json({
      message: 'Sexo creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updateSex = async (req, res) => {
  const { id_sex, name_sex, status_sex } = req.body;
  try {
    if (isInputEmpty(name_sex)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_sex)) {
      throw new Error('El sexo no debe contener caracteres especiales');
    }

    if (isNotNumber(id_sex)) {
      throw new Error('Los datos del sexo son invalidos');
    }

    if (isNotNumber(status_sex)) {
      throw new Error('Los datos de estado del sexo son invalidos');
    }

    const checkExists = await instanceSex.getSex(id_sex);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de sexo, debido a que no existe');
    }

    const queryResponse = await instanceSex.updateSex(id_sex, name_sex, status_sex);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del sexo');
    }

    return res.status(200).json({
      message: 'Tipo de sexo actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusSex = async (req, res) => {
  const { id_sex, status_sex } = req.body;

  try {
    if (isNotNumber(id_sex)) throw new Error('Los datos del sexo son invalidos');

    const checkExists = await instanceSex.getSex(id_sex);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de sexo, debido a que no existe');
    }

    const queryResponse = await instanceSex.toggleStatusSex(id_sex, status_sex);

    if (!queryResponse) {
      throw new Error('Error al cambiar estado de sexo');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteSex = async (req, res) => {
  const { id_sex } = req.body;
  try {
    if (isNotNumber(id_sex)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de sexo, intente reiniciando el sitio');
    }

    const queryResponse = await instanceSex.deleteSex(id_sex);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de sexo');
    }

    return res.status(200).json({
      message: 'Tipo de sexo eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
