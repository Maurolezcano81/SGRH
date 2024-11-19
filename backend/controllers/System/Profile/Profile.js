import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class ProfileController {
  constructor() {
    this.model = new BaseModel('profile', 'name_profile');
    this.nameFieldId = 'id_profile';
    this.nameFieldToSearch = 'name_profile';
  }

  async getProfiles(req, res) {
    const { filters } = req.body;

    try {
      const list = await this.model.getAllPaginationWhereFilteredActives(
        'status_profile',
        filters
      );

      if (list.length < 1) {
        return res.status(200).json({
          message: 'No hay perfiles disponibles',
        });
      }

      return res.status(200).json({
        message: 'Perfiles obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    const { value_profile } = req.body;
    try {
      if (isInputEmpty(value_profile)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de perfil son inválidos');
      }

      const queryResponse = await this.model.getOne(value_profile, this.nameFieldToSearch);

      if (!queryResponse) {
        throw new Error('Error al obtener el perfil');
      }

      return res.status(200).json({
        message: 'Perfil obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createProfile(req, res) {
    const { name_profile, nm_fk } = req.body;

    try {
      if (isInputEmpty(name_profile)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_profile)) {
        throw new Error('El perfil no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_profile, this.nameFieldToSearch);

      if (checkExists.length > 0) {
        throw new Error('Perfil ya existente');
      }

      const queryResponse = await this.model.createOne({ name_profile, nm_fk });

      if (!queryResponse) {
        throw new Error('Error al crear perfil');
      }

      return res.status(200).json({
        message: 'Perfil creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    const { id_profile, name_profile, status_profile, nm_fk } = req.body;
    try {
      if (isInputEmpty(name_profile)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_profile)) {
        throw new Error('El perfil no debe contener caracteres especiales');
      }
      if (isNotNumber(id_profile)) {
        throw new Error('Los datos del perfil son inválidos');
      }
      if (isNotNumber(status_profile)) {
        throw new Error('Los datos de estado del perfil son inválidos');
      }

      const checkExists = await this.model.getOne(id_profile, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este perfil, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne(
        { name_profile, status_profile, nm_fk },
        [this.nameFieldId, id_profile]
      );

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del perfil');
      }

      return res.status(200).json({
        message: 'Perfil actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusProfile(req, res) {
    const { id_profile, status_profile } = req.body;
    try {
      if (isNotNumber(id_profile)) {
        throw new Error('Los datos del perfil son inválidos');
      }

      const checkExists = await this.model.getOne(id_profile, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el perfil, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne(
        { status_profile },
        [this.nameFieldId, id_profile]
      );

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del perfil');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteProfile(req, res) {
    const { value_profile } = req.body;

    console.log(req.body)
    try {
      if (isNotNumber(value_profile)) {
        throw new Error('Los datos del perfil son inválidos');
      }

      const queryResponse = await this.model.deleteOne(value_profile, 'id_profile');

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar perfil');
      }

      return res.status(200).json({
        message: 'Perfil eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default ProfileController;
