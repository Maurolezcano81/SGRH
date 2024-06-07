import Subject from '../../models/System/Subject.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceSubject = new Subject();

export const getSubjects = async (req, res) => {
  try {
    const queryResponse = await instanceSubject.getSubjects();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de sujetos de mensaje disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de sujetos de mensaje obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de tipo de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getSubject = async (req, res) => {
  const { value_subject } = req.body;
  try {
    if (isInputEmpty(value_subject)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de sujeto de mensaje son invalidos');
    }
    
    const queryResponse = await instanceSubject.getSubject(value_subject);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el tipo de sujeto de mensaje');
    }

    return res.status(200).json({
      message: 'Tipo de sujeto de mensaje obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createSubject = async (req, res) => {
  const { name_sm } = req.body;
  try {
    if (isInputEmpty(name_sm)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_sm)) {
      throw new Error('El tipo de sujeto de mensaje no debe contener caracteres especiales');
    }

    const checkExists = await instanceSubject.getSubject(name_sm);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de sujero de mensaje ya existente');
    }

    const queryResponse = await instanceSubject.createSubject(name_sm);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de sujeto de mensaje');
    }

    return res.status(200).json({
      message: 'Tipo de sujeto de mensaje creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  const { id_sm, name_sm, status_sm } = req.body;
  try {
    if (isInputEmpty(name_sm)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_sm)) {
      throw new Error('El tipo de sujeto de mensaje no debe contener caracteres especiales');
    }

    if (isNotNumber(id_sm)) {
      throw new Error('Los datos del tipo de sujeto de mensaje son invalidos');
    }

    if (isNotNumber(status_sm)) {
      throw new Error('Los datos de estado del tipo de sujeto de mensaje son invalidos');
    }

    const checkExists = await instanceSubject.getSubject(id_sm);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de sujeto de mensaje, debido a que no existe');
    }

    const queryResponse = await instanceSubject.updateSubject(id_sm, name_sm, status_sm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del sujeto de mensaje');
    }

    return res.status(200).json({
      message: 'Tipo de sujeto de mensaje actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusSubject = async (req, res) => {
  const { id_sm, status_sm } = req.body;

  try {
    if (isNotNumber(id_sm)) throw new Error('Los datos del tipo de sujeto de mensaje son invalidos');

    const checkExists = await instanceSubject.getSubject(id_sm);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de sujeto de mensaje, debido a que no existe');
    }

    const queryResponse = await instanceSubject.toggleStatusSubject(id_sm, status_sm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de sujeto de mensaje');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteSubject = async (req, res) => {
  const { id_sm } = req.body;
  try {
    if (isNotNumber(id_sm)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de sujeto de mensaje, intente reiniciando el sitio');
    }

    const queryResponse = await instanceSubject.deleteSubject(id_sm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de sujeto de mensaje');
    }

    return res.status(200).json({
      message: 'Tipo de sujeto de mensaje eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de sujeto de mensaje: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
