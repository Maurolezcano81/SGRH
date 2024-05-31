import Nacionality from '../../../models/Admin/System/Nacionality.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

const instanceNacionality = new Nacionality();

export const getNacionalities = async (req, res) => {
  try {
    const queryResponse = await instanceNacionality.getNacionalities();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay nacionalidades disponibles',
      });
    }

    return res.status(200).json({
      message: 'Listado de nacionalidades obtenido con exito',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getNacionality = async (req, res) => {
  const { value_nacionality } = req.body;
  try {
    if (isInputEmpty(value_nacionality)) {
      throw new Error('Los datos que estas utilizando para la busqueda de nacionalidad son invalidos');
    }
    const queryResponse = await instanceNacionality.getNacionality(value_nacionality);

    if (queryResponse.length < 1) {
      throw new Error('Esta nacionalidad no existe');
    }

    return res.status(200).json({
      message: 'Nacionalidad obtenida correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createNacionality = async (req, res) => {
  const { name_nacionality, abbreviation_nacionality } = req.body;
  try {
    if (isInputEmpty(name_nacionality) || isInputEmpty(abbreviation_nacionality)) {
      throw new Error('Debe completar todos los campos de nacionalidad');
    }

    if (isNotAToZ(name_nacionality)) {
      throw new Error('No estan permitidos los caracteres especiales');
    }

    const checkExistsName = await instanceNacionality.getNacionality(name_nacionality);
    const checkExistsAbbrev = await instanceNacionality.getNacionality(abbreviation_nacionality);

    if (checkExistsName && checkExistsName.length > 0) {
      throw new Error('Ya existe un pais con este nombre, ingrese otro');
    }

    if (checkExistsAbbrev && checkExistsAbbrev.length > 0) {
      throw new Error('Ya existe esta abreviacion relacionada a un pais, ingrese otra');
    }

    const queryResponse = await instanceNacionality.createNacionality(name_nacionality, abbreviation_nacionality);

    if (!queryResponse) {
      throw new Error('Error al crear la nacionalidad');
    }

    return res.status(200).json({
      message: 'Nacionalidad creada correctamente.',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateNacionality = async (req, res) => {
  const { nacionality_data } = req.body;
  try {

    if (
      isInputEmpty(nacionality_data.id_nacionality) ||
      isInputEmpty(nacionality_data.name_nacionality) ||
      isInputEmpty(nacionality_data.abbreviation_nacionality)
    ) {
      throw new Error('Debe completar todos los campos');
    }

    if (isNotAToZ(nacionality_data.name_nacionality) || isNotAToZ(nacionality_data.abbreviation_nacionality)) {
      throw new Error('No debe ingresar caracteres especiales');
    }

    const checkExists = await instanceNacionality.getNacionality(nacionality_data.id_nacionality);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar la nacionalidad, debido a que no existe');
    }

    const queryResponse = await instanceNacionality.updateNacionality(nacionality_data);

    if(queryResponse.affectedRows < 1){
      throw new Error("Error al actualizar la nacionalidad")
  }

    return res.status(200).json({
      message: 'Nacionalidad actualizada correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusNacionality = async (req, res) => {
  const { id_nacionality, status_nacionality } = req.body;
  try {
    if (isInputEmpty(status_nacionality)) {
      throw new Error('Ha ocurrido un error al actualizar la nacionalidad, intente reiniciando sitio');
    }

    const checkExist = await instanceNacionality.getNacionality(id_nacionality);

    if (checkExist.length < 1) {
      throw new Error('No se puede actualizar la nacionalidad, debido a que no existe');
    }

    const queryResponse = await instanceNacionality.toggleStatusNacionality(id_nacionality, status_nacionality);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado de la nacionalidad');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteNacionality = async (req, res) => {
  const { id_nacionality } = req.body;
  try {
    if (isNotNumber(id_nacionality)) {
      throw new Error('Ha ocurrido un error al eliminar la nacionalidad, intente reiniciando el sitio');
    }

    const queryResponse = await instanceNacionality.deleteNacionality(id_nacionality);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar la nacionalidad');
    }

    return res.status(200).json({
      message: 'La nacionalidad ha sido eliminada exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
