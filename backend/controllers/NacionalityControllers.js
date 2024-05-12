import Nacionality from '../models/Nacionality.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../middlewares/Validations.js';

const instanceNacionality = new Nacionality();

export const getNacionalities = async (req, res) => {
  try {
    const queryResponse = await instanceNacionality.getNacionalities();

    if (!queryResponse) {
      throw new Error('Ocurrio un error al obtener el listado de Nacionalidades');
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
  const { id } = req.params;
  try {
    const queryResponse = await instanceNacionality.getNacionality(id);

    if (!queryResponse) {
      throw new Error('Error al obtener la nacionalidad');
    }

    return res.status(200).json({
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
  const { name, abbreviation } = req.body;
  try {
    if (isInputEmpty(name) || isInputEmpty(abbreviation)) {
      throw new Error('Debe completar todos los campos');
    }

    if (isNotAToZ(name) || isNotAToZ(abbreviation)) {
      throw new Error('No estan permitidos los caracteres especiales');
    }

    const checkExistsName = await instanceNacionality.getCountry(name);
    const checkExistsAbbrev = await instanceNacionality.getCountry(abbreviation);

    if (checkExistsName && checkExistsName.length > 0) {
      throw new Error('Ya existe un pais con este nombre, ingrese otro');
    }

    if (checkExistsAbbrev && checkExistsAbbrev.length > 0) {
      throw new Error('Ya existe esta abreviacion relacionada a un pais, ingrese otra');
    }


    const queryResponse = await instanceNacionality.createNacionality(name, abbreviation);

    if (!queryResponse) {
      throw new Error('Error al crear la nacionalidad');
    }

    return res.status(200).json({
      message: 'Nacionalidad creada correctamente.',
      queryResponse
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateNacionality = async (req, res) => {
  const { name, abbreviation } = req.body;
  const {id} = req.params
  try {
    const checkExist = await instanceNacionality.getNacionality(id);

    if (!checkExist) {
      throw new Error('La nacionalidad a actualizar no existe');
    }

    if (
      isInputEmpty(id) ||
      isInputEmpty(name) ||
      isInputEmpty(abbreviation)
    ) {
      throw new Error('Debe completar todos los campos');
    }

    if (isNotAToZ(name) || isNotAToZ(abbreviation)) {
      throw new Error('No debe ingresar caracteres especiales');
    }

    const queryResponse = await instanceNacionality.updateNacionality(id, name, abbreviation);

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
  const {value} = req.body;
  const {id} = req.params
  try {
    const checkExist = await instanceNacionality.getNacionality(id);

    if (!checkExist) {
      throw new Error('La Nacionalidad a actualizar no existe');
    }

    if (isInputEmpty(value)) {
      throw new Error('Ha ocurrido un error al cambiar el estado de la nacionalidad');
    }

    const queryResponse = await instanceNacionality.toggleStatusNacionality();

    if (!queryResponse) {
      throw new Error('Ha ocurrido un error al cambiar el estado de la nacionalidad');
    }

    return res.status(200).json({
      message: 'Estado actualizado correctamente.',
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
  const { id } = req.params;
  try {
    if (isInputEmpty(id)) {
      throw new Error('Ha ocurrido un error al eliminar la nacionalidad.');
    }

    const queryResponse = await instanceNacionality.deleteNacionality(Number(id));

    if (!queryResponse) {
      throw new Error('Ha ocurrido un error al eliminar la nacionalidad.');
    }

    return res.status(200).json({
      message: 'Nacionalidad eliminada exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de Nacionalidad: ' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
