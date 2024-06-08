import NavigationMenu from '../../models/System/NavigationMenu.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceNavigationMenu = new NavigationMenu();

export const getNavigationMenus = async (req, res) => {
  try {
    const queryResponse = await instanceNavigationMenu.getNavigationMenus();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de menu de navegacion disponibles',
      });
    }

    return res.status(200).json({
      message: 'Tipos de menu de navegacion obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de tipo de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const getNavigationMenu = async (req, res) => {
  const { value_nm } = req.body;
  try {
    if (isInputEmpty(value_nm)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de menu de navegacion son invalidos');
    }
    
    const queryResponse = await instanceNavigationMenu.getNavigationMenu(value_nm);

    if (queryResponse.length < 1) {
      throw new Error('Error al obtener el tipo de menu de navegacion');
    }

    return res.status(200).json({
      message: 'Tipo de menu de navegacion obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const createNavigationMenu = async (req, res) => {
  const { name_nm } = req.body;
  try {
    if (isInputEmpty(name_nm)) {
      throw new Error('Debes completar todos los campos');
    }
    if (isNotAToZ(name_nm)) {
      throw new Error('El tipo de menu de navegacion no debe contener caracteres especiales');
    }

    const checkExists = await instanceNavigationMenu.getNavigationMenu(name_nm);

    if (checkExists && checkExists.length > 0) {
      throw new Error('Tipo de menu de navegacion ya existente');
    }

    const queryResponse = await instanceNavigationMenu.createNavigationMenu(name_nm);

    if (!queryResponse) {
      throw new Error('Error al crear tipo de menu de navegacion');
    }

    return res.status(200).json({
      message: 'Tipo de menu de navegacion creado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const updatedNavigationMenu = async (req, res) => {
  const { id_nm, name_nm, status_nm } = req.body;
  try {
    if (isInputEmpty(name_nm)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotAToZ(name_nm)) {
      throw new Error('El tipo de menu de navegacion no debe contener caracteres especiales');
    }

    if (isNotNumber(id_nm)) {
      throw new Error('Los datos del tipo de menu de navegacion son invalidos');
    }

    if (isNotNumber(status_nm)) {
      throw new Error('Los datos de estado del tipo de menu de navegacion son invalidos');
    }

    const checkExists = await instanceNavigationMenu.getNavigationMenu(id_nm);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de menu de navegacion, debido a que no existe');
    }

    const queryResponse = await instanceNavigationMenu.updatedNavigationMenu(id_nm, name_nm, status_nm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos del menu de navegacion');
    }

    return res.status(200).json({
      message: 'Tipo de menu de navegacion actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusNavigationMenu = async (req, res) => {
  const { id_nm, status_nm } = req.body;

  try {
    if (isNotNumber(id_nm)) throw new Error('Los datos del tipo de menu de navegacion son invalidos');

    const checkExists = await instanceNavigationMenu.getNavigationMenu(id_nm);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de menu de navegacion, debido a que no existe');
    }

    const queryResponse = await instanceNavigationMenu.toggleStatusNavigationMenu(id_nm, status_nm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al cambiar estado del tipo de menu de navegacion');
    }

    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteNavigationMenu = async (req, res) => {
  const { id_nm } = req.body;
  try {
    if (isNotNumber(id_nm)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de menu de navegacion, intente reiniciando el sitio');
    }

    const queryResponse = await instanceNavigationMenu.deleteNavigationMenu(id_nm);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de menu de navegacion');
    }

    return res.status(200).json({
      message: 'Tipo de menu de navegacion eliminado exitosamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador de menu de navegacion: ' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
