import Occupation from '../../models/Occupation.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceOccupation = new Occupation();

export const getOccupations = async (req, res) => {
  try {
    const queryResponse = await instanceOccupation.getOccupations();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay puestos de trabajo disponibles',
      });
    }

    return res.status(200).json({
      message: 'Listado de puestos de trabajo obtenido con exito',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getOccupation = async (req, res) => {
  const { value_occupation } = req.body;
  try {
    if (isInputEmpty(value_occupation)) {
      throw new Error('Los datos que estas utilizando para la busqueda de puestos de trabajo son invalidos');
    }

    const queryResponse = await instanceOccupation.getOccupation(value_occupation);
    if (!queryResponse || queryResponse.length < 1) {
      throw new Error('Este puesto de trabajo no existe');
    }
    return res.status(200).json({
      message: 'Puesto de trabajo obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createOccupation = async (req, res) => {
  const { name_occupation, salary_occupation } = req.body;
  try {
    if (isInputEmpty(name_occupation) || isInputEmpty(salary_occupation)) {
      throw new Error('Debe completar todos los campos de puesto de trabajo');
    }

    if (isNotNumber(salary_occupation)) {
      throw new Error('El salario debe estar expresado en valor numerico');
    }

    if (isNotAToZ(name_occupation)) {
      throw new Error('El nombre no debe contener caracteres especiales');
    }

    const checkExist = await instanceOccupation.getOccupation(name_occupation);

    if (checkExist && checkExist.length > 0) {
      throw new Error('Ya existe un puesto de trabajo con este nombre, ingrese otro');
    }

    const queryResponse = await instanceOccupation.createOccupation(name_occupation, salary_occupation);

    if (!queryResponse) {
      throw new Error('Error al crear el puesto de trabajo');
    }
    return res.status(200).json({
      message: 'Puesto de trabajo creado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateOccupation = async (req, res) => {
  const { occupation_data } = req.body;
  try {
    const { id_occupation, name_occupation, salary_occupation, status_occupation } = occupation_data;

    if (
      isInputEmpty(id_occupation) ||
      isInputEmpty(name_occupation) ||
      isInputEmpty(salary_occupation) ||
      isInputEmpty(status_occupation)
    ) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotNumber(salary_occupation)) {
      throw new Error('El salario debe ser un valor numerico');
    }

    if (isNotAToZ(name_occupation)) {
      throw new Error('El nombre del puesto de trabajo no puede contener caracteres especiales');
    }

    if (isNotNumber(status_occupation)) {
      throw new Error('Ha ocurrido un error al introducir el tipo de estado');
    }

    const checkExist = await instanceOccupation.getOccupation(id_occupation);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el puesto de trabajo debido a que no existe');
    }

    const queryResponse = await instanceOccupation.updateOccupation(occupation_data);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el puesto de trabajo');
    }

    return res.status(200).json({
      message: 'Puesto de trabajo actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusOccupation = async (req, res) => {
  const { id_occupation, status_occupation } = req.body;
  try {
    if (isInputEmpty(id_occupation) || isInputEmpty(status_occupation)) {
      throw new Error(
        'Ha ocurrido un error al actualizar el puesto de trabajo, reinicie el sitio e intentelo de nuevo'
      );
    }

    const checkExist = await instanceOccupation.getOccupation(id_occupation);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el puesto de trabajo debido a que no existe');
    }

    const queryResponse = await instanceOccupation.toggleStatusOccupation(id_occupation, status_occupation);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado del puesto de trabajo');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteOccupation = async (req, res) => {
  const { id_occupation } = req.body;
  try {
    if (isNotNumber(id_occupation)) {
      throw new Error('Ha ocurrido un error al eliminar el puesto de trabajo, intente reiniciando el sitio');
    }

    const queryResponse = await instanceOccupation.deleteOccupation(id_occupation);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el puesto de trabajo');
    }
    return res.status(200).json({
      message: 'El puesto de trabajo ha sido eliminado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Occupation' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
