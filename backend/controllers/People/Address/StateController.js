import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

class StateControllers {
  constructor() {
    this.model = new BaseModel('state', 'name_state');
    this.countryModel = new BaseModel('country', 'name_country');
    this.nameFieldId = "id_state";
    this.nameFieldToSearch = "name_state";
  }

  async getStates(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay provincias disponibles',
        });
      }

      return res.status(200).json({
        message: 'Provincias obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getState(req, res) {
    const { value_state } = req.body;
    try {
      if (isInputEmpty(value_state)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de provincia son inválidos');
      }

      const queryResponse = await this.model.getOne(value_state, this.nameFieldId);

      if (!queryResponse) {
        throw new Error('Error al obtener la provincia');
      }

      return res.status(200).json({
        message: 'Provincia obtenida correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createState(req, res) {
    const data = req.body;
    try {
      if (isInputEmpty(data.name_state)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(data.name_state)) {
        throw new Error('El nombre de la provincia no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(data.name_state, this.nameFieldToSearch);

      if (checkExists) {
        throw new Error('Provincia ya existente');
      }

      const queryResponse = await this.model.createOne(data);
      if (!queryResponse) {
        throw new Error('Error al crear la provincia');
      }

      return res.status(200).json({
        message: 'Provincia creada exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateState(req, res) {
    const { id_state, name_state, status_state } = req.body;

    try {
      if (isInputEmpty(name_state)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_state)) {
        throw new Error('El nombre de la provincia no debe contener caracteres especiales');
      }

      if (isNotNumber(id_state)) {
        throw new Error('Los datos de la provincia son inválidos');
      }

      if (isNotNumber(status_state)) {
        throw new Error('Los datos de estado de la provincia son inválidos');
      }

      const checkExists = await this.model.getOne(id_state, this.nameFieldId);

      if (!checkExists) {
        throw new Error('No se puede actualizar esta provincia, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_state, status_state }, [this.nameFieldId, id_state]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos de la provincia');
      }

      return res.status(200).json({
        message: 'Provincia actualizada correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusState(req, res) {
    const { id_state, status_state } = req.body;

    try {
      if (isNotNumber(id_state)) throw new Error('Los datos de la provincia son inválidos');

      const checkExists = await this.model.getOne(id_state, this.nameFieldId);

      if (!checkExists) {
        throw new Error('No se puede actualizar el estado de la provincia, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_state }, [this.nameFieldId, id_state]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado de la provincia');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteState(req, res) {
    const { id_state } = req.body;
    try {
      if (isNotNumber(id_state)) {
        throw new Error('Ha ocurrido un error al eliminar la provincia, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_state, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar la provincia');
      }

      return res.status(200).json({
        message: 'Provincia eliminada exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getStatesByCountry(req, res) {
    const { country_fk } = req.body;
    try {
      if (isInputEmpty(country_fk)) {
        throw new Error('Debe completar todos los campos de Domicilio');
      }

      const checkExistCountry = await this.countryModel.getOne(country_fk, 'id_country');
      if (!checkExistCountry) {
        return res.status(200).json({
          message: 'Este país no existe',
        });
      }

      const queryResponse = await this.model.getAllPaginationWhere(10, 0, 'name_state', 'ASC', { country_fk });

      return res.status(200).json({
        message: 'Provincias obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincias: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default StateControllers;
