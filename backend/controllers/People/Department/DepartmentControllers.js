import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
import DepartmentModel from '../../../models/Department/Deparment.js';
class DepartmentController {
  constructor() {
    this.model = new DepartmentModel()
    this.nameFieldId = 'id_department';
    this.nameFieldToSearch = 'name_department';
    this.edo = new BaseModel('entity_department_occupation', 'id_edo');
    this.occupation = new BaseModel("occupation", "name_occupation")
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

      const getTotalResults = await this.model.getTotalDepartmentsInformation(limit, offset, order, orderBy, filters);

      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: getTotalResults[0].total
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

      const getTotalResults = await this.model.getTotalDepartmentInformation(limit, offset, orderBy, order, newFilters);


      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: getTotalResults[0].total
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

      const getTotalResults = await this.model.totalResultsInOtherDepartment(id_department);

      console.log(getTotalResults)
      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: getTotalResults[0].total
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

      if (!createEdo) {
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

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de departamento, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_department', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de departamento disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de departamento obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de departamento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de departamento",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_department', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de departamento, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de departamento obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de departamento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de departamento",
      });
    }
  }

  async getOne(req, res) {
    const { value_department } = req.body;
    try {
      if (isInputEmpty(value_department)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de departamento son inválidos');
      }

      const queryResponse = await this.model.getOne(value_department, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el departamento');
      }

      return res.status(200).json({
        message: 'Tipo de departamento obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de departamento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_department } = req.body;
    try {
      if (isInputEmpty(name_department)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_department)) {
        return res.status(403).json({
          message: "El departamento no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_department, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de departamento ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_department });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de departamento"
        })
      }

      return res.status(200).json({
        message: 'departamento creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de departamento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de departamento",
      });
    }
  }

  async updateOne(req, res) {
    const { id_department, name_department, status_department } = req.body;
    try {
      if (isInputEmpty(name_department)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_department)) {
        return res.status(403).json({
          message: "El departamento no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_department)) {
        return res.status(403).json({
          message: "Los datos de estado del departamento son inválidos"
        })
      }

      if (isNotNumber(status_department)) {
        return res.status(403).json({
          message: "Los datos de estado del departamento son inválidos"
        })
      }

      if (isNotAToZ(name_department)) {
        return res.status(403).json({
          message: "El departamento no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_department, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de departamento, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_department, 'name_department');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_department != id_department) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_department, status_department }, [this.nameFieldId, id_department]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de departamento",
        });
      }

      return res.status(200).json({
        message: 'Tipo de departamento actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de departamento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de departamento",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_department } = req.body;
    try {

      if (isNotNumber(id_department)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de departamento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_department, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de departamento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de departamento eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de departamento: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de departamento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_department, status_department } = req.body;
    try {

      if (isNotNumber(id_department)) {
        return res.status(403).json({
          message: "Los datos de estado del departamento son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_department, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de departamento, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_department }, [this.nameFieldId, id_department]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de departamento",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de departamento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de departamento",
      });
    }
  }
}

export default DepartmentController;
