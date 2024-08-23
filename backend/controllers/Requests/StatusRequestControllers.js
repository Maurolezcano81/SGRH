import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

class StatusRequestControllers {
  constructor() {
    this.model = new BaseModel('status_request', 'name_sr');
    this.nameFieldId = "id_sr";
    this.nameFieldToSearch = "name_sr";
  }

  async getStatusesRequest(req, res) {
    try {
      const queryResponse = await this.model.getAll();

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de estados disponibles',
        });
      }

      return res.status(200).json({
        message: 'Listado de estados obtenido exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getStatusRequest(req, res) {
    const { value_sr } = req.body;
    try {
      if (isInputEmpty(value_sr)) {
        throw new Error('Los datos utilizados para la búsqueda del estado son inválidos');
      }

      const queryResponse = await this.model.getOne(value_sr, this.nameFieldToSearch);

      if (queryResponse.length < 1) {
        throw new Error('Este tipo de estado no existe');
      }

      return res.status(200).json({
        message: 'Tipo de estado obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createStatusRequest(req, res) {
    const { name_sr } = req.body;
    try {
      if (isInputEmpty(name_sr)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_sr)) {
        throw new Error('El nombre no debe tener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_sr, this.nameFieldToSearch);

      if (checkExists.length > 0) {
        throw new Error('Tipo de estado ya existente');
      }

      const queryResponse = await this.model.createOne({ name_sr });
      if (!queryResponse) {
        throw new Error('Error al crear tipo de estado');
      }

      return res.status(200).json({
        message: 'El estado de respuesta se ha creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateStatusRequest(req, res) {
    const { id_sr, name_sr, status_sr } = req.body;
    try {
      if (isInputEmpty(name_sr) || isInputEmpty(status_sr)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotNumber(status_sr) || isInputWithWhiteSpaces(status_sr)) {
        throw new Error('El tipo de estado es inválido');
      }

      if (isNotAToZ(name_sr)) {
        throw new Error('El nombre de tipo de estado no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(id_sr, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('Este tipo de estado no existe');
      }

      const queryResponse = await this.model.updateOne({ name_sr, status_sr }, [this.nameFieldId, id_sr]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el tipo de estado de solicitud');
      }

      return res.status(200).json({
        message: 'El tipo de estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusRequest(req, res) {
    const { id_sr, status_sr } = req.body;
    try {
      if (isNotNumber(id_sr)) {
        throw new Error('Los datos del estado de solicitud son inválidos');
      }

      const checkExists = await this.model.getOne(id_sr, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de estado, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_sr }, [this.nameFieldId, id_sr]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el estado del tipo de estado de solicitud');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteStatusRequest(req, res) {
    const { id_sr } = req.body;
    try {
      if (isNotNumber(id_sr)) {
        throw new Error('Los datos del estado de solicitud son inválidos');
      }

      const queryResponse = await this.model.deleteOne(id_sr, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de estado de solicitud');
      }

      return res.status(200).json({
        message: 'El tipo de estado de solicitud ha sido eliminado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Status Request: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default StatusRequestControllers;
