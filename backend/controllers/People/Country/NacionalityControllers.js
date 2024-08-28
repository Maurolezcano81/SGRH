import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class NacionalityController {
  constructor() {
    this.model = new BaseModel('nacionality', 'name_nacionality');
    this.nameFieldId = 'id_nacionality';
    this.nameFieldToSearch = 'name_nacionality';
  }

  async getNacionalities(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    
    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay nacionalidades disponibles',
        });
      }

      return res.status(200).json({
        message: 'Listado de nacionalidades obtenido con éxito',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - getNacionalities:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getNacionality(req, res) {
    const { value_nacionality } = req.body;
    
    try {
      if (isInputEmpty(value_nacionality)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de nacionalidad son inválidos');
      }

      const queryResponse = await this.model.getOne(value_nacionality, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Esta nacionalidad no existe');
      }

      return res.status(200).json({
        message: 'Nacionalidad obtenida correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - getNacionality:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createNacionality(req, res) {
    const { name_nacionality, abbreviation_nacionality } = req.body;
    
    try {
      if (isInputEmpty(name_nacionality) || isInputEmpty(abbreviation_nacionality)) {
        throw new Error('Debe completar todos los campos de nacionalidad');
      }

      if (isNotAToZ(name_nacionality) || isNotAToZ(abbreviation_nacionality)) {
        throw new Error('No están permitidos los caracteres especiales');
      }

      const checkExistsName = await this.model.getOne(name_nacionality, this.nameFieldToSearch);
      const checkExistsAbbrev = await this.model.getOne(abbreviation_nacionality, 'abbreviation_nacionality');

      if (checkExistsName.length > 0) {
        throw new Error('Ya existe una nacionalidad con este nombre, ingrese otro');
      }

      if (checkExistsAbbrev.length > 0) {
        throw new Error('Ya existe esta abreviación relacionada a una nacionalidad, ingrese otra');
      }

      const queryResponse = await this.model.createOne({ name_nacionality, abbreviation_nacionality });

      if (!queryResponse) {
        throw new Error('Error al crear la nacionalidad');
      }

      return res.status(200).json({
        message: 'Nacionalidad creada correctamente.',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - createNacionality:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateNacionality(req, res) {
    const { id_nacionality, name_nacionality, abbreviation_nacionality, status_nacionality } = req.body;
    
    try {
      if (isInputEmpty(id_nacionality) || isInputEmpty(name_nacionality) || isInputEmpty(abbreviation_nacionality) || isInputEmpty(status_nacionality)) {
        throw new Error('Debe completar todos los campos');
      }

      if (isNotAToZ(name_nacionality) || isNotAToZ(abbreviation_nacionality)) {
        throw new Error('No debe ingresar caracteres especiales');
      }

      const checkExists = await this.model.getOne(id_nacionality, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar la nacionalidad, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne(id_nacionality, { name_nacionality, abbreviation_nacionality, status_nacionality });

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar la nacionalidad');
      }

      return res.status(200).json({
        message: 'Nacionalidad actualizada correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - updateNacionality:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusNacionality(req, res) {
    const { id_nacionality, status_nacionality } = req.body;
    
    try {
      if (isInputEmpty(id_nacionality) || isInputEmpty(status_nacionality)) {
        throw new Error('Ha ocurrido un error al actualizar el estado de la nacionalidad');
      }

      const checkExists = await this.model.getOne(id_nacionality, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar la nacionalidad, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({status_nacionality}, [this.nameFieldId, id_nacionality]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el estado de la nacionalidad');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - toggleStatusNacionality:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteNacionality(req, res) {
    const { id_nacionality } = req.body;
    
    try {
      if (isNotNumber(id_nacionality)) {
        throw new Error('El ID de la nacionalidad es inválido');
      }

      const queryResponse = await this.model.deleteOne(id_nacionality);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar la nacionalidad');
      }

      return res.status(200).json({
        message: 'La nacionalidad ha sido eliminada exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Nacionalidad - deleteNacionality:', error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default NacionalityController;
