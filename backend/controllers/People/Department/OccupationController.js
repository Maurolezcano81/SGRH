import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

class OccupationControllers {
  constructor() {
    this.model = new BaseModel('occupation', 'name_occupation');
    this.nameFieldId = "id_occupation";
    this.nameFieldToSearch = "name_occupation";
  }

  async getOccupations(req, res) {
    try {
      const { limit, offset, order, typeOrder, filters } = req.body;
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay puestos de trabajo disponibles',
        });
      }

      return res.status(200).json({
        message: 'Listado de puestos de trabajo obtenido con éxito',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puestos de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getOccupation(req, res) {
    const { value_occupation } = req.body;
    try {
      if (isInputEmpty(value_occupation)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de puestos de trabajo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_occupation, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Este puesto de trabajo no existe');
      }

      return res.status(200).json({
        message: 'Puesto de trabajo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOccupation(req, res) {
    const { name_occupation, salary_occupation } = req.body;
    try {
      if (isInputEmpty(name_occupation) || isInputEmpty(salary_occupation)) {
        throw new Error('Debes completar todos los campos de puesto de trabajo');
      }

      if (isNotNumber(salary_occupation)) {
        throw new Error('El salario debe estar expresado en valor numérico');
      }

      if (isNotAToZ(name_occupation)) {
        throw new Error('El nombre no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_occupation, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Ya existe un puesto de trabajo con este nombre, ingrese otro');
      }

      const queryResponse = await this.model.createOne({ name_occupation, salary_occupation });
      if (!queryResponse) {
        throw new Error('Error al crear el puesto de trabajo');
      }

      return res.status(200).json({
        message: 'Puesto de trabajo creado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateOccupation(req, res) {
    const { id_occupation, name_occupation, salary_occupation, status_occupation } = req.body;
    try {
      if (isInputEmpty(id_occupation) || isInputEmpty(name_occupation) || isInputEmpty(salary_occupation) || isInputEmpty(status_occupation)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotNumber(salary_occupation)) {
        throw new Error('El salario debe ser un valor numérico');
      }

      if (isNotAToZ(name_occupation)) {
        throw new Error('El nombre del puesto de trabajo no puede contener caracteres especiales');
      }

      if (isNotNumber(status_occupation)) {
        throw new Error('Ha ocurrido un error al introducir el estado');
      }

      const checkExists = await this.model.getOne(id_occupation, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el puesto de trabajo debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_occupation, salary_occupation, status_occupation }, [this.nameFieldId, id_occupation]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el puesto de trabajo');
      }

      return res.status(200).json({
        message: 'Puesto de trabajo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusOccupation(req, res) {
    const { id_occupation, status_occupation } = req.body;
    try {
      if (isNotNumber(id_occupation) || isNotNumber(status_occupation)) {
        throw new Error('Los datos proporcionados son inválidos');
      }

      const checkExists = await this.model.getOne(id_occupation, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el puesto de trabajo debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_occupation }, [this.nameFieldId, id_occupation]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar el estado del puesto de trabajo');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteOccupation(req, res) {
    const { id_occupation } = req.body;
    try {
      if (isNotNumber(id_occupation)) {
        throw new Error('Ha ocurrido un error al eliminar el puesto de trabajo, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_occupation, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el puesto de trabajo');
      }

      return res.status(200).json({
        message: 'El puesto de trabajo ha sido eliminado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default OccupationControllers;
