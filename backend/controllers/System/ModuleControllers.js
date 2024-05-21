import Module from '../../models/Module.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceModule = new Module();
export const getModules = async (req, res) => {
  try {
    const queryResponse = await instanceModule.getModules();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay modulos disponibles',
      });
    }
    return res.status(200).json({
      message: 'Listado de modulos obtenido con exito',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getModule = async (req, res) => {
  const { value_module } = req.body;
  try {
    const queryResponse = await instanceModule.getModule(value_module);

    if (isInputEmpty(value_module)) {
      throw new Error('Los datos que estas utilizando para la busqueda de modulos son invalidos');
    }

    if (!queryResponse || queryResponse.length < 1) {
      throw new Error('Este modulo no existe');
    }
    return res.status(200).json({
      message: 'Modulo obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createModule = async (req, res) => {
  const { name_module, url_module } = req.body;
  try {
    if (isInputEmpty(name_module) || isInputEmpty(url_module)) {
      throw new Error('Debe completar todos los campos de modulos');
    }

    if (isInputWithWhiteSpaces(url_module)) {
      throw new Error('La direccion del modulo no debe estar contener espacios en blanco');
    }

    if (isNotAToZ(name_module)) {
      throw new Error('El nombre no debe contener caracteres especiales');
    }

    const checkExist = await instanceModule.getModule(name_module);

    if (checkExist && checkExist.length > 0) {
      throw new Error('Ya existe un modulo con este nombre, ingrese otro');
    }

    const queryResponse = await instanceModule.createModule(name_module, url_module);

    if (!queryResponse) {
      throw new Error('Error al crear el modulo');
    }
    return res.status(200).json({
      message: 'Modulo creado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateModule = async (req, res) => {
  const { module_data } = req.body;
  try {
    const { id_module, name_module, status_module } = module_data;

    if (isInputEmpty(id_module) || isInputEmpty(name_module) || isInputEmpty(status_module)) {
      throw new Error('Debes completar todos los campos de modulo');
    }

    if (isNotNumber(status_module)) {
      throw new Error('El tipo de estado es incorrecto');
    }

    if (isNotAToZ(name_module)) {
      throw new Error('El nombre del modulo no puede contener caracteres especiales');
    }

    const checkExist = await instanceModule.getModule(id_module);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el modulo debido a que no existe');
    }

    const queryResponse = await instanceModule.updateModule(module_data);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el modulo');
    }
    return res.status(200).json({
      message: 'Modulo creado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusModule = async (req, res) => {
  const { id_module, status_module } = req.body;
  try {
    if (isInputEmpty(id_module) || isInputEmpty(status_module)) {
      throw new Error('Ha ocurrido un error al actualizar el modulo, reinicie el sitio e intentelo de nuevo');
    }

    const checkExist = await instanceModule.getModule(id_module);

    if (checkExist && checkExist.length < 1) {
      throw new Error('No se puede actualizar el modulo debido a que no existe');
    }

    const queryResponse = await instanceModule.toggleStatusModule(id_module, status_module);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado del modulo');
    }
    return res.status(200).json({
      message: 'Estado de modulo actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteModule = async (req, res) => {
  const { id_module } = req.body;
  try {
    if (isNotNumber(id_module)) {
      throw new Error('Ha ocurrido un error al eliminar el modulo, intente reiniciando el sitio');
    }

    const queryResponse = await instanceModule.deleteModule(id_module);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el modulo');
    }
    return res.status(200).json({
      message: 'El modulo ha sido eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Module' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
