import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class DepartmentController {
  constructor() {
    this.model = new BaseModel('department', 'name_department'); // Asegúrate de que 'department' y 'name_department' coincidan con tu modelo
    this.nameFieldId = 'id_department';
    this.nameFieldToSearch = 'name_department';
  }

  async getDepartments(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;
    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay departamentos disponibles',
        });
      }

      return res.status(200).json({
        message: 'Departamentos obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - getDepartments: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getDepartment(req, res) {
    const { id_department } = req.body;
    try {
      if (isInputEmpty(id_department)) {
        throw new Error('El ID del departamento es inválido');
      }

      const queryResponse = await this.model.getOne(id_department, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Departamento no encontrado');
      }

      return res.status(200).json({
        message: 'Departamento obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - getDepartment: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createDepartment(req, res) {
    const { name_department } = req.body;
    try {
      if (isInputEmpty(name_department)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_department)) {
        throw new Error('El nombre del departamento no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_department, this.nameFieldToSearch);

      if (checkExists.length > 0) {
        throw new Error('Departamento ya existente');
      }

      const queryResponse = await this.model.createOne({ name_department });
      if (!queryResponse) {
        throw new Error('Error al crear el departamento');
      }

      return res.status(200).json({
        message: 'Departamento creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - createDepartment: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateDepartment(req, res) {
    const { id_department, name_department, status_department } = req.body;
    try {
      if (isInputEmpty(name_department) || isInputEmpty(status_department)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_department)) {
        throw new Error('El nombre del departamento no debe contener caracteres especiales');
      }

      if (isNotNumber(id_department)) {
        throw new Error('ID del departamento inválido');
      }

      if (isNotNumber(status_department)) {
        throw new Error('Estado del departamento inválido');
      }

      const checkExists = await this.model.getOne(id_department, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('Departamento no encontrado');
      }

      const queryResponse = await this.model.updateOne({ name_department, status_department }, [this.nameFieldId, id_department]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar el departamento');
      }

      return res.status(200).json({
        message: 'Departamento actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - updateDepartment: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusDepartment(req, res) {
    const { id_department, status_department } = req.body;
    try {
      if (isNotNumber(id_department) || isNotNumber(status_department)) {
        throw new Error('Datos inválidos para cambiar el estado del departamento');
      }

      const checkExists = await this.model.getOne(id_department, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('Departamento no encontrado');
      }

      const queryResponse = await this.model.updateOne({ status_department }, [this.nameFieldId, id_department]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar el estado del departamento');
      }

      return res.status(200).json({
        message: 'Estado del departamento actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - toggleStatusDepartment: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteDepartment(req, res) {
    const { id_department } = req.body;
    try {
      if (isNotNumber(id_department)) {
        throw new Error('ID del departamento inválido');
      }

      const queryResponse = await this.model.deleteOne(id_department, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el departamento');
      }

      return res.status(200).json({
        message: 'Departamento eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento - deleteDepartment: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default DepartmentController;
