import Document from '../../models/System/Document.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

const instanceDocument = new Document();

export const getDocuments = async (req, res) => {
  try {
    const queryResponse = await instanceDocument.getDocuments();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de documento disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de documento obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getDocument = async (req, res) => {
  const { value_document } = req.body;
  try {
    if (isInputEmpty(value_document)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de documento son invalidos');
    }
    
    const queryResponse = await instanceDocument.getDocument(value_document);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el documento');
    }

    return res.status(200).json({
      message: 'Tipo de documento obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createDocument = async (req, res) => {
  const { name_document } = req.body;
  try {
    if (isInputEmpty(name_document)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_document)) {
      throw new Error('El documento no debe contener caracteres especiales');
    }

    const checkExists = await instanceDocument.getDocument(name_document);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de documento ya existente');
    }

    const queryResponse = await instanceDocument.createDocument(name_document);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de documento');
    }

    return res.status(200).json({
      message: 'Tipo de documento creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  const { id_document, name_document, status_document } = req.body;
  try {
    if (isInputEmpty(name_document)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_document)) {
      throw new Error('El tipo de documento no debe contener caracteres especiales');
    }

    if (isNotNumber(id_document)) {
      throw new Error('Los datos del tipo de documento son invalidos');
    }

    if (isNotNumber(status_document)) {
      throw new Error('Los datos de estado del tipo de documento son invalidos');
    }

    const checkExists = await instanceDocument.getDocument(id_document);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de documento, debido a que no existe');
    }

    const queryResponse = await instanceDocument.updateDocument(id_document, name_document, status_document);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del documento');
    }

    return res.status(200).json({
      message: 'Tipo de documento actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusDocument = async (req, res) => {
  const { id_document, status_document } = req.body;

  try {
    if (isNotNumber(id_document)) throw new Error('Los datos del tipo de documento son invalidos');

    const checkExists = await instanceDocument.getDocument(id_document);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de documento, debido a que no existe');
    }

    const queryResponse = await instanceDocument.toggleStatusDocument(id_document, status_document);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de documento');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  const { id_document } = req.body;
  try {
    if (isNotNumber(id_document)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de documento, intente reiniciando el sitio');
    }

    const queryResponse = await instanceDocument.deleteDocument(id_document);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de documento');
    }

    return res.status(200).json({
      message: 'Tipo de documento eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de documento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
