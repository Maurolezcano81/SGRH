import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../../middlewares/Validations.js';

class CountryController {
  constructor() {
    this.model = new BaseModel('country', 'id_country');
    this.nameFieldId = 'id_country';
    this.nameFieldToSearch = 'name_country';
  }

  async getCountries(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;

    try {
      const queryResponse = await this.model.getAllPaginationWhere(100, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({ message: 'No hay países disponibles' });
      }

      return res.status(200).json({
        message: 'Listado de países',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - getCountries:', error.message);
      return res.status(403).json({ message: error.message });
    }
  }

  async getCountry(req, res) {
    const { value_country } = req.body;

    try {
      if (isInputEmpty(value_country)) {
        throw new Error('Los datos utilizados para la búsqueda de país son inválidos');
      }

      const queryResponse = await this.model.getOne(value_country, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('El país no existe');
      }

      return res.status(200).json({
        message: 'País obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - getCountry:', error.message);
      return res.status(403).json({ message: error.message });
    }
  }

  async createCountry(req, res) {
    const { name_country, abbreviation_country } = req.body;

    try {
      if (isInputEmpty(name_country) || isInputEmpty(abbreviation_country)) {
        throw new Error('Debe completar todos los campos');
      }

      if (isNotAToZ(name_country) || isNotAToZ(abbreviation_country)) {
        throw new Error('No están permitidos los caracteres especiales');
      }

      const checkExistsName = await this.model.getOne(name_country, this.nameFieldToSearch);
      const checkExistsAbbrev = await this.model.getOne(abbreviation_country, 'abbreviation_country');

      if (checkExistsName.length > 0) {
        throw new Error('Ya existe un país con este nombre');
      }

      if (checkExistsAbbrev.length > 0) {
        throw new Error('Ya existe esta abreviación relacionada a un país');
      }

      const queryResponse = await this.model.createOne({ name_country, abbreviation_country });

      return res.status(200).json({
        message: 'País creado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - createCountry:', error.message);
      return res.status(403).json({ message: error.message });
    }
  }

  async updateCountry(req, res) {
    const { id_country, name_country, abbreviation_country, status_country } = req.body;

    try {
      if (isInputEmpty(id_country) || isInputEmpty(name_country) || isInputEmpty(abbreviation_country) || isInputEmpty(status_country)) {
        throw new Error('Debe completar todos los campos');
      }

      const checkExists = await this.model.getOne(id_country, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el país, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(name_country, 'name_country');

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }

      const queryResponse = await this.model.updateOne({ name_country, abbreviation_country, status_country }, ['id_country', id_country]);

      return res.status(200).json({
        message: 'País actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - updateCountry:', error.message);
      return res.status(403).json({ message: "Ha ocurrido un error al modificar este registro" });
    }
  }

  async toggleStatusCountry(req, res) {
    const { id_country, status_country } = req.body;

    try {
      if (isNotNumber(status_country)) {
        throw new Error('El estado del país es inválido');
      }

      const checkExists = await this.model.getOne(id_country, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el estado del país, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({status_country}, [this.nameFieldId, id_country]);

      return res.status(200).json({
        message: 'Estado del país actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - toggleStatusCountry:', error.message);
      return res.status(403).json({ message: error.message });
    }
  }

  async deleteCountry(req, res) {
    const { id_country } = req.body;

    try {
      if (isNotNumber(id_country)) {
        throw new Error('El ID del país es inválido');
      }

      const queryResponse = await this.model.deleteOne(id_country);

      return res.status(200).json({
        message: 'País eliminado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en CountryController - deleteCountry:', error.message);
      return res.status(403).json({ message: error.message });
    }
  }
}

export default CountryController;
