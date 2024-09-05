import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
import DepartmentModel from '../../../models/Department/Deparment.js';
class DepartmentController {
  constructor() {
    this.model = new DepartmentModel()
    this.nameFieldId = 'id_department';
    this.nameFieldToSearch = 'name_department';
    this.edo = new BaseModel('entity_department_occupation', 'id_edo');
  }

  async getDepartmentsInfo(req, res) {
    const { limit, offset, order, orderBy, filters } = req.body;

    try {
      const list = await this.model.getDepartmentsInformation(limit, offset, orderBy, order, filters);

      if (!list) {
        return res.status(403).json({
          message: "Ha ocurrido un error al obtener los usuarios, intentalo de nuevo"
        })
      }

      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: list.length
      })

    } catch (error) {
      console.log(error);
    }

  }


  async getDepartmentInfo(req, res) {
    const { id_department } = req.params;
    const { limit, offset, order, orderBy, filters } = req.body;


    const newFilters = {
      ...filters,
      id_department: id_department
    }

    try {
      const list = await this.model.getDepartmentInformation(limit, offset, orderBy, order, newFilters);

      if (!list) {
        return res.status(403).json({
          message: "Ha ocurrido un error al obtener los usuarios, intentalo de nuevo"
        })
      }

      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: list.length
      })

    } catch (error) {
      console.log(error);
    }
  }

  async getEmployeesInOtherDepartment(req, res) {
    const { id_department } = req.params;
    const { limit, offset, order, typeOrder, filters } = req.body;

    try {
      const list = await this.model.getEmployeesInOtherDepartment(id_department, limit, offset, typeOrder, order, filters);


      if (!list) {
        return res.status(403).json({
          message: "Ha ocurrido un error al obtener los usuarios, intentalo de nuevo"
        })
      }

      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: list.length
      })

    } catch (error) {
      console.log(error);
    }
  }

  async AddEmployeeToDepartment(req, res) {
    const { id_edo, department_fk, entity_fk, occupation_fk } = req.body;



    try {
      if (isInputEmpty(department_fk) || isInputEmpty(entity_fk) || isInputEmpty(occupation_fk)) {
        return res.status(403).json({
          message: "Los datos para agregar un empleado son incorrectos"
        })
      }

      const createEdo = await this.edo.createOne({
        entity_fk: entity_fk,
        department_fk: department_fk,
        occupation_fk: occupation_fk
      })

      if (createEdo.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha ocurrido un problema al agregar al empleado"
        });
      }

      const updateOldEdo = await this.model.rotationPersonalOnDepartment(id_edo, department_fk)

      if (updateOldEdo.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha ocurrido un problema al agregar al empleado"
        });
      }

      return res.status(200).json({
        message: "Personal agregado correctamente",
        createEdo
      })
    } catch (error) {
      console.error('Error en controlador de departamento - getDepartments: ' + error.message);
      return res.status(403).json({
        message: error.message,
      });
    }

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
