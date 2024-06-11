import Attachment from '../../models/System/Attachment.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceAttachment = new Attachment();

export const getAttachments = async (req, res) => {
  try {
    const queryResponse = await instanceAttachment.getAttachments();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de anexo disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de anexo obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de tipo de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getAttachment = async (req, res) => {
  const { value_attachment } = req.body;
  try {
    if (isInputEmpty(value_attachment)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de anexo son invalidos');
    }
    
    const queryResponse = await instanceAttachment.getAttachment(value_attachment);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el tipo de anexo');
    }

    return res.status(200).json({
      message: 'Tipo de anexo obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createAttachment = async (req, res) => {
  const { name_ta } = req.body;
  try {
    if (isInputEmpty(name_ta)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_ta)) {
      throw new Error('El tipo de anexo no debe contener caracteres especiales');
    }

    const checkExists = await instanceAttachment.getAttachment(name_ta);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de sujero de mensaje ya existente');
    }

    const queryResponse = await instanceAttachment.createAttachment(name_ta);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de anexo');
    }

    return res.status(200).json({
      message: 'Tipo de anexo creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updatedAttachment = async (req, res) => {
  const { id_ta, name_ta, status_ta } = req.body;
  try {
    if (isInputEmpty(name_ta)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_ta)) {
      throw new Error('El tipo de anexo no debe contener caracteres especiales');
    }

    if (isNotNumber(id_ta)) {
      throw new Error('Los datos del tipo de anexo son invalidos');
    }

    if (isNotNumber(status_ta)) {
      throw new Error('Los datos de estado del tipo de anexo son invalidos');
    }

    const checkExists = await instanceAttachment.getAttachment(id_ta);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de anexo, debido a que no existe');
    }

    const queryResponse = await instanceAttachment.updateAttachment(id_ta, name_ta, status_ta);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del anexo');
    }

    return res.status(200).json({
      message: 'Tipo de anexo actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusAttachment = async (req, res) => {
  const { id_ta, status_ta } = req.body;

  try {
    if (isNotNumber(id_ta)) throw new Error('Los datos del tipo de anexo son invalidos');

    const checkExists = await instanceAttachment.getAttachment(id_ta);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de anexo, debido a que no existe');
    }

    const queryResponse = await instanceAttachment.toggleStatusAttachment(id_ta, status_ta);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de anexo');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteAttachment = async (req, res) => {
  const { id_ta } = req.body;
  try {
    if (isNotNumber(id_ta)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de anexo, intente reiniciando el sitio');
    }

    const queryResponse = await instanceAttachment.deleteAttachment(id_ta);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de anexo');
    }

    return res.status(200).json({
      message: 'Tipo de anexo eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de anexo: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
