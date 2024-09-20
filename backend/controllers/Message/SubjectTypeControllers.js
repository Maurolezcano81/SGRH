import BaseModel from '../../models/BaseModel.js';

import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';



class SubjectTypeControllers {
  constructor() {
    this.model = new BaseModel('subject_message', 'name_sm');
    this.nameFieldId = "id_sm"
    this.nameFieldToSearch = "name_sm"
  }

  async getSubjects(req, res) {
    const {limit, offset, order, typeOrder, filters} = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(100, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de sujetos de mensaje disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de sujetos de mensaje obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getSubject(req, res) {
    const { value_subject } = req.body;
    try {
      if (isInputEmpty(value_subject)) {
        throw new Error('Los datos que estas utilizando para la busqueda de tipo de sujeto de mensaje son invalidos');
      }

      const queryResponse = await this.model.getOne(value_subject, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de sujeto de mensaje');
      }

      return res.status(200).json({
        message: 'Tipo de sujeto de mensaje obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createSubject(req, res) {
    const data = req.body;
    try {
      if (isInputEmpty(data.name_sm)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(data.name_sm)) {
        throw new Error('El tipo de sujeto de mensaje no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(data.name_sm, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        console.log("hola")
        throw new Error('Tipo de sujeto de mensaje ya existente');
      }

      const queryResponse = await this.model.createOne(data);
      if (!queryResponse) {
        throw new Error('Error al crear tipo de sujeto de mensaje');
      }

      return res.status(200).json({
        message: 'Tipo de sujeto de mensaje creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateSubject(req, res) {
    const { id_sm, name_sm, status_sm } = req.body;

    try {
      if (isInputEmpty(name_sm)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_sm)) {
        throw new Error('El tipo de sujeto de mensaje no debe contener caracteres especiales');
      }

      if (isNotNumber(id_sm)) {
        throw new Error('Los datos del tipo de sujeto de mensaje son invalidos');
      }

      if (isNotNumber(status_sm)) {
        throw new Error('Los datos de estado del tipo de sujeto de mensaje son invalidos');
      }

      const checkExists = await this.model.getOne(id_sm, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de sujeto de mensaje, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(name_sm, this.nameFieldToSearch);

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }

      const queryResponse = await this.model.updateOne({name_sm, status_sm}, [this.nameFieldId, id_sm]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del sujeto de mensaje');
      }

      return res.status(200).json({
        message: 'Tipo de sujeto de mensaje actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusSubject(req, res) {
    const { id_sm, status_sm } = req.body;

    try {
      if (isNotNumber(id_sm)) throw new Error('Los datos del tipo de sujeto de mensaje son invalidos');

      const checkExists = await this.model.getOne(id_sm, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de sujeto de mensaje, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({status_sm}, [this.nameFieldId, id_sm]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de sujeto de mensaje');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteSubject(req, res) {
    const { id_sm } = req.body;
    try {
      if (isNotNumber(id_sm)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de sujeto de mensaje, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_sm, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de sujeto de mensaje');
      }

      return res.status(200).json({
        message: 'Tipo de sujeto de mensaje eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sujeto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default SubjectTypeControllers