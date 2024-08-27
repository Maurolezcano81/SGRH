import BaseModel from '../../models/BaseModel.js';

import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class TypeOfLeaveControllers {
  constructor() {
    this.model = new BaseModel('type_of_leave', 'name_tol');
    this.nameFieldId = "id_tol";
    this.nameFieldToSearch = "name_tol";
  }

  async getTypesOfLeave(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de licencia disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de licencia obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipos de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getTypeOfLeave(req, res) {
    const { value_tol } = req.body;
    try {
      if (isInputEmpty(value_tol)) {
        throw new Error('Los datos que estas utilizando para la búsqueda de tipo de licencia son inválidos');
      }

      const queryResponse = await this.model.getOne(value_tol, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de licencia');
      }

      return res.status(200).json({
        message: 'Tipo de licencia obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createTypeOfLeave(req, res) {
    const data = req.body;
    try {
      if (isInputEmpty(data.name_tol)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(data.name_tol)) {
        throw new Error('El tipo de licencia no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(data.name_tol, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Tipo de licencia ya existente');
      }

      const queryResponse = await this.model.createOne(data);

      if (!queryResponse) {
        throw new Error('Error al crear tipo de licencia');
      }

      return res.status(200).json({
        message: 'Tipo de licencia creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateTypeOfLeave(req, res) {
    const { id_tol, name_tol, status_tol } = req.body;

    try {
      if (isInputEmpty(name_tol)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_tol)) {
        throw new Error('El tipo de licencia no debe contener caracteres especiales');
      }

      if (isNotNumber(id_tol)) {
        throw new Error('Los datos del tipo de licencia son inválidos');
      }

      if (isNotNumber(status_tol)) {
        throw new Error('Los datos de estado del tipo de licencia son inválidos');
      }

      const checkExists = await this.model.getOne(id_tol, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de licencia, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_tol, status_tol }, [this.nameFieldId, id_tol]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del tipo de licencia');
      }

      return res.status(200).json({
        message: 'Tipo de licencia actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusTypeOfLeave(req, res) {
    const { id_tol, status_tol } = req.body;

    try {
      if (isNotNumber(id_tol)) throw new Error('Los datos del tipo de licencia son inválidos');

      const checkExists = await this.model.getOne(id_tol, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de licencia, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_tol }, [this.nameFieldId, id_tol]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de licencia');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteTypeOfLeave(req, res) {
    const { id_tol } = req.body;
    try {
      if (isNotNumber(id_tol)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de licencia, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_tol, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de licencia');
      }

      return res.status(200).json({
        message: 'Tipo de licencia eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default TypeOfLeaveControllers;
