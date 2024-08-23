import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

class CityControllers {
  constructor() {
    this.model = new BaseModel('city', 'name_city');
    this.stateModel = new BaseModel('state', 'name_state');
    this.nameFieldId = "id_city";
    this.nameFieldToSearch = "name_city";
    this.defaultOrderBy = "name_city";
  }

  async getCities(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay ciudades disponibles',
        });
      }

      return res.status(200).json({
        message: 'Ciudades obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getCity(req, res) {
    const { value_city } = req.body;
    try {
      if (isInputEmpty(value_city)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de ciudad son inválidos');
      }

      const queryResponse = await this.model.getOne(value_city, this.nameFieldId);

      if (!queryResponse) {
        throw new Error('Error al obtener la ciudad');
      }

      return res.status(200).json({
        message: 'Ciudad obtenida correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createCity(req, res) {
    const data = req.body;
    try {
      if (isInputEmpty(data.name_city)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(data.name_city)) {
        throw new Error('El nombre de la ciudad no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(data.name_city, this.nameFieldToSearch);

      if (checkExists) {
        throw new Error('Ciudad ya existente');
      }

      const queryResponse = await this.model.createOne(data);
      if (!queryResponse) {
        throw new Error('Error al crear la ciudad');
      }

      return res.status(200).json({
        message: 'Ciudad creada exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateCity(req, res) {
    const { id_city, name_city, status_city } = req.body;

    try {
      if (isInputEmpty(name_city)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_city)) {
        throw new Error('El nombre de la ciudad no debe contener caracteres especiales');
      }

      if (isNotNumber(id_city)) {
        throw new Error('Los datos de la ciudad son inválidos');
      }

      if (isNotNumber(status_city)) {
        throw new Error('Los datos de estado de la ciudad son inválidos');
      }

      const checkExists = await this.model.getOne(id_city, this.nameFieldId);

      if (!checkExists) {
        throw new Error('No se puede actualizar esta ciudad, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_city, status_city }, [this.nameFieldId, id_city]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos de la ciudad');
      }

      return res.status(200).json({
        message: 'Ciudad actualizada correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusCity(req, res) {
    const { id_city, status_city } = req.body;

    try {
      if (isNotNumber(id_city)) throw new Error('Los datos de la ciudad son inválidos');

      const checkExists = await this.model.getOne(id_city, this.nameFieldId);

      if (!checkExists) {
        throw new Error('No se puede actualizar el estado de la ciudad, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_city }, [this.nameFieldId, id_city]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado de la ciudad');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteCity(req, res) {
    const { id_city } = req.body;
    try {
      if (isNotNumber(id_city)) {
        throw new Error('Ha ocurrido un error al eliminar la ciudad, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_city, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar la ciudad');
      }

      return res.status(200).json({
        message: 'Ciudad eliminada exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getCitiesByState(req, res) {
    const { state_fk } = req.body; // ids puede ser un array de IDs o un solo ID


      // Obtener ciudades usando getAllPaginationWhere para manejar múltiples IDs
      const queryResponse = await this.model.getAllPaginationWhere(undefined, undefined, undefined, undefined, { state_fk: state_fk });

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No se encontraron ciudades relacionadas a la provincia',
        });
      }

      return res.status(200).json({
        message: 'Ciudades obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

export default CityControllers;
