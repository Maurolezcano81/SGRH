import Department from '../../models/Department/Department.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceDepartment = new Department();

export const getDepartments = async (req, res) => {
  try {
    const queryResponse = await instanceDepartment.getDepartments();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay departamentos disponibles',
      });
    }

    return res.status(200).json({
      message: 'Departamentos obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getDepartment = async (req, res) => {
  const { id_department } = req.body;
  try {
    if (isInputEmpty(id_department)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de departamento son invalidos');
    }

    const queryResponse = await instanceDepartment.getDepartment(value_department);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el departamento');
    }

    return res.status(200).json({
      message: 'Tipo de departamento obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createDepartment = async (req, res) => {
  const { name_department } = req.body;
  try {
    if (isInputEmpty(name_department)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_department)) {
      throw new Error('El departamento no debe contener caracteres especiales');
    }

    const checkExists = await instanceDepartment.getDepartment(name_department);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de departamento ya existente');
    }

    const queryResponse = await instanceDepartment.createDepartment(name_department);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de departamento');
    }

    return res.status(200).json({
      message: 'Tipo de departamento creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  const { id_department, name_department, status_department } = req.body;
  try {
    if (isInputEmpty(name_department)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_department)) {
      throw new Error('El tipo de departamento no debe contener caracteres especiales');
    }

    if (isNotNumber(id_department)) {
      throw new Error('Los datos del tipo de departamento son invalidos');
    }

    if (isNotNumber(status_department)) {
      throw new Error('Los datos de estado del tipo de departamento son invalidos');
    }

    const checkExists = await instanceDepartment.getDepartment(id_department);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de departamento, debido a que no existe');
    }

    const queryResponse = await instanceDepartment.updateDepartment(id_department, name_department, status_department);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del departamento');
    }

    return res.status(200).json({
      message: 'Tipo de departamento actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusDepartment = async (req, res) => {
  const { id_department, status_department } = req.body;

  try {
    if (isNotNumber(id_department)) throw new Error('Los datos del tipo de departamento son invalidos');

    const checkExists = await instanceDepartment.getDepartment(id_department);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de departamento, debido a que no existe');
    }

    const queryResponse = await instanceDepartment.toggleStatusDepartment(id_department, status_department);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de departamento');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id_department } = req.body;
  try {
    if (isNotNumber(id_department)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de departamento, intente reiniciando el sitio');
    }

    const queryResponse = await instanceDepartment.deleteDepartment(id_department);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de departamento');
    }

    return res.status(200).json({
      message: 'Tipo de departamento eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de departamento: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
