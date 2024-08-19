import Contact from '../../models/System/Contact.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../../../middlewares/Validations.js';

const instanceContact = new Contact();
export const getContacts = async (req, res) => {
  try {
    const queryResponse = await instanceContact.getContacts();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay tipos de contactos',
      });
    }

    return res.status(200).json({
      message: 'Tipos de contacto obtenidos correctamente',
      queryResponse,
    });
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getContact = async (req, res) => {
  const { value_contact } = req.body;
  try {
    if (isInputEmpty(value_contact)) {
      throw new Error('Los datos que estas utilizando para la busqueda de tipo de contacto son invalidos');
    }

    const queryResponse = await instanceContact.getContact(value_contact);

    if (queryResponse.length < 1) {
      throw new Error('El tipo de contacto no existe');
    }

    return res.status(200).json({
      message: 'Tipo de contacto obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Contacto' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createContact = async (req, res) => {
  const { name_contact } = req.body;
  try {
    if (isInputEmpty(name_contact)) {
      throw new Error('Debe completar todos los campos');
    }

    if (isNotAToZ(name_contact)) {
      throw new Error('No estan permitidos los caracteres especiales');
    }

    const checkExistsName = await instanceContact.getContact(name_contact);

    if (checkExistsName && checkExistsName.length > 0) {
      throw new Error('Ya existe un contacto con este nombre, ingrese otro');
    }

    const queryResponse = await instanceContact.createContact(name_contact);
    if (!queryResponse) {
      throw new Error('Error al crear el tipo de contacto');
    }
    return res.status(200).json({
      message: 'Tipo de contacto creado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Contacto' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateContact = async (req, res) => {
  const { name_contact, status_contact, id_contact } = req.body;
  try {
    if (isInputEmpty(name_contact || status_contact)) {
      throw new Error('Debes completar todos los campos');
    }

    if (isNotNumber(status_contact) || isInputWithWhiteSpaces(status_contact)) {
      throw new Error('El tipo de contacto es invalido');
    }

    if (isNotAToZ(name_contact)) {
      throw new Error('El nombre de tipo de contacto no debe contener caracteres especiales');
    }

    const checkExists = await instanceContact.getContact(id_contact);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar este tipo de contacto, debido a que no existe');
    }

    const queryResponse = await instanceContact.updateContact(id_contact, name_contact, status_contact);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar datos de tipo de contacto');
    }
    return res.status(200).json({
      message: 'El tipo de contacto ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Contacto' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusContact = async (req, res) => {
  const { status_contact, id_contact } = req.body;
  try {
    if (isNotNumber(status_contact)) {
      throw new Error('Ha ocurrido un error al actualizar el estado, intente reiniciando sitio');
    }

    const checkExists = await instanceContact.getContact(id_contact);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el tipo de contacto, debido a que no existe');
    }

    const queryResponse = await instanceContact.toggleStatusContact(id_contact, status_contact);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado del tipo de contacto');
    }
    return res.status(200).json({
      message: 'El estado ha sido actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Contacto' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  const { id_contact } = req.body;
  try {
    if (isNotNumber(id_contact)) {
      throw new Error('Ha ocurrido un error al eliminar el tipo de contacto, intente reiniciando el sitio');
    }

    const queryResponse = await instanceContact.deleteContact(id_contact);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el tipo de contacto');
    }
    return res.status(200).json({
      message: 'El tipo de contacto ha sido eliminado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Contacto' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
