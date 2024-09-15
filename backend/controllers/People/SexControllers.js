import BaseModel from '../../models/BaseModel.js'; 
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class SexControllers {
  constructor() {
    this.model = new BaseModel('sex', 'name_sex'); 
    this.nameFieldId = 'id_sex';
    this.nameFieldToSearch = 'name_sex';
  }

  async getSexs(req, res) {
    try {
      const { limit, offset, order, typeOrder, filters } = req.body;
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de sexo disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de sexo obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getSex(req, res) {
    const { value_sex } = req.body;
    try {
      if (isInputEmpty(value_sex)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de sexo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_sex, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el sexo');
      }

      return res.status(200).json({
        message: 'Tipo de sexo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createSex(req, res) {
    const { name_sex } = req.body;
    try {
      if (isInputEmpty(name_sex)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_sex)) {
        throw new Error('El sexo no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_sex, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Tipo de sexo ya existente');
      }

      const queryResponse = await this.model.createOne({ name_sex });
      if (!queryResponse) {
        throw new Error('Error al crear tipo de sexo');
      }

      return res.status(200).json({
        message: 'Sexo creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateSex(req, res) {
    const { id_sex, name_sex, status_sex } = req.body;
    try {
      if (isInputEmpty(name_sex)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_sex)) {
        throw new Error('El sexo no debe contener caracteres especiales');
      }

      if (isNotNumber(id_sex)) {
        throw new Error('Los datos del sexo son inválidos');
      }

      if (isNotNumber(status_sex)) {
        throw new Error('Los datos de estado del sexo son inválidos');
      }

      const checkExists = await this.model.getOne(id_sex, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de sexo, debido a que no existe');
      }

      const checkDuplicate = await this.model.getOne(name_sex, 'name_sex');

      if (checkDuplicate.length > 0) {
        return res.status(403).json({
          message: 'No se puede actualizar, debido a que ya es un registro existente'
        })
      }

      const queryResponse = await this.model.updateOne({ name_sex, status_sex }, [this.nameFieldId, id_sex]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del sexo');
      }

      return res.status(200).json({
        message: 'Tipo de sexo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusSex(req, res) {
    const { id_sex, status_sex } = req.body;

    try {
      if (isNotNumber(id_sex)) throw new Error('Los datos del sexo son inválidos');

      const checkExists = await this.model.getOne(id_sex, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de sexo, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_sex }, [this.nameFieldId, id_sex]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del sexo');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteSex(req, res) {
    const { id_sex } = req.body;
    try {
      if (isNotNumber(id_sex)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de sexo, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_sex, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de sexo');
      }

      return res.status(200).json({
        message: 'Tipo de sexo eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default SexControllers;
