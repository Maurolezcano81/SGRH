import BaseModel from '../../../models/BaseModel.js';  
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class DocumentControllers {
  constructor() {
    this.model = new BaseModel('document', 'name_document'); 
    this.nameFieldId = "id_document";
    this.nameFieldToSearch = "name_document";
  }

  async getDocuments(req, res) {
    try {
      const { limit, offset, order, typeOrder, filters } = req.body;
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de documento disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de documento obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getDocument(req, res) {
    const { value_document } = req.body;
    try {
      if (isInputEmpty(value_document)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de documento son inválidos');
      }

      const queryResponse = await this.model.getOne(value_document, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el documento');
      }

      return res.status(200).json({
        message: 'Tipo de documento obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createDocument(req, res) {
    const { name_document } = req.body;
    try {
      if (isInputEmpty(name_document)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_document)) {
        throw new Error('El documento no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_document, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Tipo de documento ya existente');
      }

      const queryResponse = await this.model.createOne({ name_document });

      if (!queryResponse) {
        throw new Error('Error al crear tipo de documento');
      }

      return res.status(200).json({
        message: 'Tipo de documento creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateDocument(req, res) {
    const { id_document, name_document, status_document } = req.body;
    try {
      if (isInputEmpty(name_document)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_document)) {
        throw new Error('El tipo de documento no debe contener caracteres especiales');
      }

      if (isNotNumber(id_document)) {
        throw new Error('Los datos del tipo de documento son inválidos');
      }

      if (isNotNumber(status_document)) {
        throw new Error('Los datos de estado del tipo de documento son inválidos');
      }

      const checkExists = await this.model.getOne(id_document, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de documento, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_document, status_document }, [this.nameFieldId, id_document]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del documento');
      }

      return res.status(200).json({
        message: 'Tipo de documento actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusDocument(req, res) {
    const { id_document, status_document } = req.body;
    try {
      if (isNotNumber(id_document)) {
        throw new Error('Los datos del tipo de documento son inválidos');
      }

      const checkExists = await this.model.getOne(id_document, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de documento, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_document }, [this.nameFieldId, id_document]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de documento');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteDocument(req, res) {
    const { id_document } = req.body;
    try {
      if (isNotNumber(id_document)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de documento, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_document, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de documento');
      }

      return res.status(200).json({
        message: 'Tipo de documento eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default DocumentControllers;
