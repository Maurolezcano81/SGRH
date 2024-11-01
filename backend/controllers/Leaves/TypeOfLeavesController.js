import BaseModel from '../../models/BaseModel.js';

import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class TypeOfLeaveControllers {
  constructor() {
    this.model = new BaseModel('type_of_leave', 'name_tol');
    this.nameFieldId = "id_tol";
    this.nameFieldToSearch = "name_tol";
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de licencia, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_tol', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de licencia disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de licencia obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de Licencia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de licencia",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_tol', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de licencia, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de licencia obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de Licencia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de licencia",
      });
    }
  }

  async getOne(req, res) {
    const { value_tol } = req.body;
    try {
      if (isInputEmpty(value_tol)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de licencia son inválidos');
      }

      const queryResponse = await this.model.getOne(value_tol, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de licencia');
      }

      return res.status(200).json({
        message: 'tipo de licencia obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de Licencia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_tol } = req.body;
    try {
      if (isInputEmpty(name_tol)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_tol)) {
        return res.status(403).json({
          message: "El tipo de licencia no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_tol, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "tipo de licencia ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_tol });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de licencia"
        })
      }

      return res.status(200).json({
        message: 'tipo de licencia creada exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de Licencia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de licencia",
      });
    }
  }

  async updateOne(req, res) {
    const { id_tol, name_tol, status_tol } = req.body;
    try {
      if (isInputEmpty(name_tol)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_tol)) {
        return res.status(403).json({
          message: "El tipo de licencia no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_tol)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de licencia son inválidos"
        })
      }

      if (isNotNumber(status_tol)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de licencia son inválidos"
        })
      }

      if (isNotAToZ(name_tol)) {
        return res.status(403).json({
          message: "El tipo de licencia no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_tol, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de licencia, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_tol, 'name_tol');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_tol != id_tol) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_tol, status_tol }, [this.nameFieldId, id_tol]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de licencia",
        });
      }

      return res.status(200).json({
        message: 'tipo de licencia actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de Licencia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de licencia",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_tol } = req.body;
    try {

      if (isNotNumber(id_tol)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de licencia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_tol, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de licencia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'tipo de licencia eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de Licencia: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de licencia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_tol, status_tol } = req.body;
    try {

      if (isNotNumber(id_tol)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de licencia son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_tol, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de licencia, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_tol }, [this.nameFieldId, id_tol]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de licencia",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Licencia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de licencia",
      });
    }
  }
}

export default TypeOfLeaveControllers;
