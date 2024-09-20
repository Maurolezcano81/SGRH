import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class TypeOfTerminationControllers {
  constructor() {
    this.model = new BaseModel('type_of_termination', 'description_tot');
    this.nameFieldId = 'id_tot';
    this.nameFieldToSearch = 'description_tot';
  }

  async getTots(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(100, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de baja disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de baja obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getTot(req, res) {
    const { value_tot } = req.body;
    try {
      if (isInputEmpty(value_tot)) {
        throw new Error('Los datos que estás utilizando para la búsqueda del tipo de baja son inválidos');
      }

      const queryResponse = await this.model.getOne(value_tot, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de baja');
      }

      return res.status(200).json({
        message: 'Tipo de baja obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createTot(req, res) {
    const { description_tot } = req.body;
    try {
      if (isInputEmpty(description_tot)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(description_tot)) {
        throw new Error('El tipo de baja no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(description_tot, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Tipo de baja ya existente');
      }

      const queryResponse = await this.model.createOne({ description_tot, status_tot: 1 });
      if (!queryResponse) {
        throw new Error('Error al crear tipo de baja');
      }

      return res.status(200).json({
        message: 'Tipo de baja creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateTot(req, res) {
    const { id_tot, description_tot, status_tot } = req.body;

    try {
      if (isInputEmpty(description_tot)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(description_tot)) {
        throw new Error('El tipo de baja no debe contener caracteres especiales');
      }

      if (isNotNumber(id_tot)) {
        throw new Error('Los datos del tipo de baja son inválidos');
      }

      if (isNotNumber(status_tot)) {
        throw new Error('Los datos del estado del tipo de baja son inválidos');
      }

      const checkExists = await this.model.getOne(id_tot, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de baja, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(description_tot, 'description_tot');

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }
      
      const queryResponse = await this.model.updateOne({ description_tot, status_tot }, [this.nameFieldId, id_tot]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del tipo de baja');
      }

      return res.status(200).json({
        message: 'Tipo de baja actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusTot(req, res) {
    const { id_tot, status_tot } = req.body;

    try {
      if (isNotNumber(id_tot)) {
        throw new Error('Los datos del tipo de baja son inválidos');
      }

      const checkExists = await this.model.getOne(id_tot, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de baja, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_tot }, [this.nameFieldId, id_tot]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de baja');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteTot(req, res) {
    const { id_tot } = req.body;
    try {
      if (isNotNumber(id_tot)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de baja, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_tot, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de baja');
      }

      return res.status(200).json({
        message: 'Tipo de baja eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de baja: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default TypeOfTerminationControllers;
