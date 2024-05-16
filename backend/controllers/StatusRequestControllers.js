import StatusRequest from '../models/Status_Request.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../middlewares/Validations.js';

const instanceStatusRequest = new StatusRequest();

export const getStatusesRequest = async (req, res) => {
  try {
    const queryResponse = await instanceStatusRequest.getStatusesRequest();

    if (queryResponse.length === 0) {
      return res.status(200).json({
        message: 'No existen tipos de estados',
      });
    }

    return res.status(200).json({
      message: 'Listado de estados obtenido exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en el controlador: ' + error.message);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getStatusRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const queryResponse = await instanceStatusRequest.getStatusRequest(id);
    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el estado');
    }
    return res.status(200).json({
      message: 'Tipo de estado obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Status Request' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createStatusRequest = async (req, res) => {
  const { name_sr } = req.body;
  try {
    if (isInputEmpty(name_sr)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_sr)) {
      throw new Error('El nombre no debe tener caracteres especiales');
    }

    const checkExists = await instanceStatusRequest.getStatusRequest(name_sr);

    if(checkExists.length >= 1){
      throw new Error("Tipo de estado de respuesta ya existente")
    }

    const queryResponse = await instanceStatusRequest.createStatusRequest(name_sr);
    if (!queryResponse) {
      throw new Error('Error al crear tipo de estado');
    }
    return res.status(200).json({
      message: 'El estado de respuesta se ha creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Status Request' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateStatusRequest = async (req, res) => {
  const { name_sr, status_sr } = req.body;
  const { id_sr } = req.params;
  try {
    const checkExists = instanceStatusRequest.getStatusRequest(id_sr);

    if (!checkExists) {
      throw new Error('Este tipo de estado no existe');
    }

    if (isInputEmpty(name_sr || status_sr)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotNumber(status_sr) || isInputWithWhiteSpaces(status_sr)) {
      throw new Error('El tipo de estado es invalido');
    }

    if (isNotAToZ(name_sr)) {
      throw new Error('El nombre de tipo de estado no debe contener caracteres especiales');
    }

    const queryResponse = await instanceStatusRequest.updateStatusRequest(name_sr, status_sr, id_sr);
    if (!queryResponse) {
      throw new Error('Error al actualizar datos de tipo de estado');
    }
    return res.status(200).json({
      message: 'El tipo de estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Status Request' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusRequest = async (req, res) => {
  const { value_sr } = req.body;
  const { id_sr } = req.params;
  try {
    if (isNotNumber(value_sr) || isNotNumber(id_sr)) {
      throw new Error('Ha ocurrido un error al actualizar el estado, intente reiniciando sitio');
    }
    const queryResponse = await instanceStatusRequest.toggleStatusRequest(value_sr, id_sr);
    if (!queryResponse) {
      throw new Error('Error al actualizar el estado del tipo de estado de solicitud');
    }
    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Status Request' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteStatusRequest = async (req, res) => {
  const { id_sr } = req.params;
  try {
    if (isNotNumber(id_sr)) {
      throw new Error('Ha ocurrido un error al eliminar el estado, intente reiniciando el sitio');
    }

    const queryResponse = await instanceStatusRequest.deleteStatusRequest(id_sr);

    if (!queryResponse) {
      throw new Error('Error al eliminar el tipo de estado de solicitud');
    }
    return res.status(200).json({
      message: 'El tipo de estado de solicitud ha sido eliminado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Status Request' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

