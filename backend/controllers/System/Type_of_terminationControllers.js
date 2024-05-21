import Type_of_termination from '../../models/Type_of_termination.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceTot = new Type_of_termination();

export const getTots = async (req, res) => {
  try {
    const queryResponse = await instanceTot.getTots();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de baja disponibles',
      });
    }
    return res.status(200).json({
      message: 'Listado de tipos de bajas obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getTot = async (req, res) => {
  const { value_tot } = req.body;
  try {
    if (isInputEmpty(value_tot)) {
      throw new Error(
        'Los datos que estas utilizando para la busqueda de tipo de baja es incorrecta, intentelo nuevamente despues de reiniciar la pagina'
      );
    }

    const queryResponse = await instanceTot.getTot(value_tot);

    if (!queryResponse || queryResponse.length < 1) {
      throw new Error('Este tipo de baja no existe');
    }
    return res.status(200).json({
      message: 'Tipo de baja obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of Termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createTot = async (req, res) => {
  const { name_tot } = req.body;
  try {
    if (isInputEmpty(name_tot)) {
      throw new Error('Debe completar todos los campos de tipo de baja');
    }

    if (isNotAToZ(name_tot)) {
      throw new Error('El nombre de tipo de baja no debe contener caracteres especiales');
    }

    const checkExist = await instanceTot.getTot(name_tot);

    if (checkExist && checkExist.length > 0) {
      throw new Error('Ya existe un tipo de baja con este nombre, ingrese otra');
    }

    const queryResponse = await instanceTot.createTot(name_tot);

    if (!queryResponse) {
      throw new Error('Error al crear el tipo de baja');
    }
    return res.status(200).json({
      message: 'Tipo de baja creada correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of Termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateTot = async (req, res) => {
  const { id_tot, name_tot, status_tot } = req.body;
  try {
    if (isInputEmpty(id_tot) || isInputEmpty(name_tot) || isInputEmpty(status_tot)) {
      throw new Error('Debes completar todos los campos del tipo de baja');
    }

    if (isNotAToZ(name_tot)) {
      throw new Error('El nombre del tipo de baja no puede contener caracteres especiales');
    }

    if (isNotNumber(status_tot)) {
      throw new Error('Ha ocurrido un error al introducir el tipo de estado');
    }

    const checkExist = await instanceTot.getTot(id_tot);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el tipo de baja debido a que no existe');
    }
    const queryResponse = await instanceTot.updateTot(name_tot, status_tot, id_tot);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el tipo de baja');
    }
    return res.status(200).json({
      message: 'Tipo de baja actualizada correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of Termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusTot = async (req, res) => {
  const { id_tot, status_tot } = req.body;
  try {
    if (isInputEmpty(id_tot) || isInputEmpty(status_tot)) {
      throw new Error('Ha ocurrido un error al actualizar el tipo de baja, reinicie el sitio e intentelo de nuevo');
    }

    const checkExist = await instanceTot.getTot(id_tot);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el tipo de baja debido a que no existe');
    }

    const queryResponse = await instanceTot.toggleStatusTot(id_tot, status_tot);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado del tipo de baja');
    }
    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of Termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteTot = async (req, res) => {
  const { id_tot } = req.body;
  try {
    if (isNotNumber(id_tot)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de baja, intente reiniciando el sitio');
    }

    const queryResponse = await instanceTot.deleteTot(id_tot);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de baja');
    }
    return res.status(200).json({
      message: 'El tipo de baja ha sido eliminado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Type of Termination' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
