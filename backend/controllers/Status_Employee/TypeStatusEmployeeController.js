import BaseModel from '../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../middlewares/Validations.js';

class TypeStatusEmployeeController {
  constructor() {
    this.model = new BaseModel('type_status_employee', 'name_tse');
    this.nameFieldId = 'id_tse';
    this.nameFieldToSearch = 'name_tse';
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de estado de empleado, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_tse', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de estado de empleado disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de estado de empleado obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de estado de empleado: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de estado de empleado",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_tse', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de estado de empleado, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de estado de empleado obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de estado de empleado: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de estado de empleado",
      });
    }
  }

  async getOne(req, res) {
    const { value_tse } = req.body;
    try {
      if (isInputEmpty(value_tse)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de estado de empleado son inválidos');
      }

      const queryResponse = await this.model.getOne(value_tse, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de estado de empleado');
      }

      return res.status(200).json({
        message: 'Tipo de estado de empleado obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de estado de empleado: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_tse } = req.body;
    try {
      if (isInputEmpty(name_tse)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_tse)) {
        return res.status(403).json({
          message: "El tipo de estado de empleado no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_tse, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de estado de empleado ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_tse });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de estado de empleado"
        })
      }

      return res.status(200).json({
        message: 'Tipo de estado de empleado creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de estado de empleado: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de estado de empleado",
      });
    }
  }

  async updateOne(req, res) {
    const { id_tse, name_tse, status_tse } = req.body;
    try {
      if (isInputEmpty(name_tse)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_tse)) {
        return res.status(403).json({
          message: "El tipo de estado de empleado no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_tse)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de empleado son inválidos"
        })
      }

      if (isNotNumber(status_tse)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de empleado son inválidos"
        })
      }

      if (isNotAToZ(name_tse)) {
        return res.status(403).json({
          message: "El tipo de estado de empleado no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_tse, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de estado de empleado, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_tse, 'name_tse');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_tse != id_tse) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_tse, status_tse }, [this.nameFieldId, id_tse]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de estado de empleado",
        });
      }

      return res.status(200).json({
        message: 'Tipo de estado de empleado actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de estado de empleado: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de estado de empleado",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_tse } = req.body;
    try {

      if (isNotNumber(id_tse)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de estado de empleado, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_tse, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de estado de empleado, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de estado de empleado eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de estado de empleado: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de estado de empleado, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_tse, status_tse } = req.body;
    try {

      if (isNotNumber(id_tse)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de empleado son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_tse, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de estado de empleado, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_tse }, [this.nameFieldId, id_tse]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de estado de empleado",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de estado de empleado: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de estado de empleado",
      });
    }
  }

  async deleteEntityContact(req, res) {
    const { id_ec } = req.body;

    try {
      const queryResponse = await this.entityContact.deleteOne(id_ec, 'id_ec');

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "No se ha podido eliminar"
        })
      }

      return res.status(200).json({
        message: "Eliminado correctamente",
        queryResponse
      })
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createEntityContact(req, res) {
    const { entity_fk, value_ec, contact_fk } = req.body;

    try {
      const queryResponse = await this.entityContact.createOne({ entity_fk, value_ec, contact_fk });

      if (queryResponse.affectedRows > 1) {
        return res.status(403).json({
          message: "Estos datos ya estan asociados a un empleado"
        })
      }

      return res.status(200).json({
        message: "Creado correctamente",
        queryResponse
      })
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default TypeStatusEmployeeController;
