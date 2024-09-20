import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class AttachmentControllers {
  constructor() {
    this.model = new BaseModel('type_attachment', 'name_ta');
    this.nameFieldId = "id_ta";
    this.nameFieldToSearch = "name_ta";
  }

  async getAttachments(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;

    try {
      const queryResponse = await this.model.getAllPaginationWhere(100, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de anexo disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de anexo obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getAttachment(req, res) {
    const { value_ta } = req.body;
    try {
      if (isInputEmpty(value_ta)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de anexo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_ta, this.nameFieldToSearch);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de anexo');
      }

      return res.status(200).json({
        message: 'Tipo de anexo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createAttachment(req, res) {
    const { name_ta } = req.body;
    try {
      if (isInputEmpty(name_ta)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_ta)) {
        throw new Error('El tipo de anexo no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_ta, this.nameFieldToSearch);

      if (checkExists.length > 0) {
        throw new Error('Tipo de anexo ya existente');
      }

      const queryResponse = await this.model.createOne({ name_ta });

      if (!queryResponse) {
        throw new Error('Error al crear tipo de anexo');
      }

      return res.status(200).json({
        message: 'Tipo de anexo creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateAttachment(req, res) {
    const { id_ta, name_ta, status_ta } = req.body;
    try {
      if (isInputEmpty(name_ta)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_ta)) {
        throw new Error('El tipo de anexo no debe contener caracteres especiales');
      }

      if (isNotNumber(id_ta)) {
        throw new Error('Los datos del tipo de anexo son inválidos');
      }

      if (isNotNumber(status_ta)) {
        throw new Error('Los datos de estado del tipo de anexo son inválidos');
      }

      const checkExists = await this.model.getOne(id_ta, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de anexo, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(name_ta, 'name_ta');

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }

      const queryResponse = await this.model.updateOne({ name_ta, status_ta }, [this.nameFieldId, id_ta]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del anexo');
      }

      return res.status(200).json({
        message: 'Tipo de anexo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusAttachment(req, res) {
    const { id_ta, status_ta } = req.body;

    try {
      if (isNotNumber(id_ta)) throw new Error('Los datos del tipo de anexo son inválidos');

      const checkExists = await this.model.getOne(id_ta, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de anexo, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_ta }, [this.nameFieldId, id_ta]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de anexo');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteAttachment(req, res) {
    const { id_ta } = req.body;
    try {
      if (isNotNumber(id_ta)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de anexo, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_ta, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de anexo');
      }

      return res.status(200).json({
        message: 'Tipo de anexo eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default AttachmentControllers;
