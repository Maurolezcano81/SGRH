import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../../middlewares/Validations.js';

class ContactController {
  constructor() {
    this.model = new BaseModel('contact', 'name_contact');
    this.nameFieldId = 'id_contact';
    this.nameFieldToSearch = 'name_contact';
  }

  async getContacts(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;

    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de contactos disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de contacto obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getContact(req, res) {
    const { value_contact } = req.body;

    try {
      if (isInputEmpty(value_contact)) {
        throw new Error('Los datos que estás utilizando para la búsqueda son inválidos');
      }

      const queryResponse = await this.model.getOne(value_contact, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('El tipo de contacto no existe');
      }

      return res.status(200).json({
        message: 'Tipo de contacto obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createContact(req, res) {
    const { name_contact } = req.body;

    try {
      if (isInputEmpty(name_contact)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_contact)) {
        throw new Error('No están permitidos los caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_contact, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Ya existe un contacto con este nombre, ingrese otro');
      }

      const queryResponse = await this.model.createOne({ name_contact });

      if (!queryResponse) {
        throw new Error('Error al crear el tipo de contacto');
      }

      return res.status(200).json({
        message: 'Tipo de contacto creado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateContact(req, res) {
    const { id_contact, name_contact, status_contact } = req.body;

    try {
      if (isInputEmpty(name_contact) || isInputEmpty(status_contact)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotNumber(status_contact)) {
        throw new Error('El estado del contacto es inválido');
      }

      if (isNotAToZ(name_contact)) {
        throw new Error('El nombre no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(id_contact, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de contacto, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(name_contact, 'name_contact');

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }

      const queryResponse = await this.model.updateOne({ name_contact, status_contact }, [this.nameFieldId, id_contact]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar los datos del tipo de contacto');
      }

      return res.status(200).json({
        message: 'El tipo de contacto ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusContact(req, res) {
    const { id_contact, status_contact } = req.body;

    try {
      if (isNotNumber(status_contact)) {
        throw new Error('El estado del contacto es inválido');
      }

      const checkExists = await this.model.getOne(id_contact, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de contacto, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_contact }, [this.nameFieldId, id_contact]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el estado del tipo de contacto');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteContact(req, res) {
    const { id_contact } = req.body;

    try {
      if (isNotNumber(id_contact)) {
        throw new Error('Error al eliminar el tipo de contacto');
      }

      const queryResponse = await this.model.deleteOne(id_contact, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de contacto');
      }

      return res.status(200).json({
        message: 'El tipo de contacto ha sido eliminado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Contact: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default ContactController;
