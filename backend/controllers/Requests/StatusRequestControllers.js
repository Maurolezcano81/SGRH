import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

class StatusRequestControllers {
  constructor() {
    this.model = new BaseModel('status_request', 'name_sr');
    this.nameFieldId = 'id_sr';
    this.nameFieldToSearch = 'name_sr';
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de estado de solicitud, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_sr', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de estado de solicitud disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de terminación obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de estado de solicitud",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_sr', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de estado de solicitud, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de terminación obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de estado de solicitud",
      });
    }
  }

  async getOne(req, res) {
    const { value_sr } = req.body;
    try {
      if (isInputEmpty(value_sr)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de estado de solicitud son inválidos');
      }

      const queryResponse = await this.model.getOne(value_sr, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de estado de solicitud');
      }

      return res.status(200).json({
        message: 'Tipo de estado de solicitud obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de terminación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_sr } = req.body;
    try {
      if (isInputEmpty(name_sr)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_sr)) {
        return res.status(403).json({
          message: "El tipo de estado de solicitud no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_sr, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de estado de solicitud ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_sr });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de estado de solicitud"
        })
      }

      return res.status(200).json({
        message: 'Tipo de estado de solicitud creada exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de estado de solicitud",
      });
    }
  }

  async updateOne(req, res) {
    const { id_sr, name_sr, status_sr } = req.body;
    try {
      if (isInputEmpty(name_sr)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_sr)) {
        return res.status(403).json({
          message: "El tipo de estado de solicitud no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_sr)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de solicitud son inválidos"
        })
      }

      if (isNotNumber(status_sr)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de solicitud son inválidos"
        })
      }

      if (isNotAToZ(name_sr)) {
        return res.status(403).json({
          message: "El tipo de estado de solicitud no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_sr, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de estado de solicitud, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_sr, 'name_sr');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_sr != id_sr) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_sr, status_sr }, [this.nameFieldId, id_sr]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de estado de solicitud",
        });
      }

      return res.status(200).json({
        message: 'Tipo de estado de solicitud actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de estado de solicitud",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_sr } = req.body;
    try {

      if (isNotNumber(id_sr)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de estado de solicitud, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_sr, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de estado de solicitud, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de estado de solicitud eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de terminación: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de estado de solicitud, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_sr, status_sr } = req.body;
    try {

      if (isNotNumber(id_sr)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de estado de solicitud son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_sr, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de estado de solicitud, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_sr }, [this.nameFieldId, id_sr]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de estado de solicitud",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de estado de solicitud",
      });
    }
  }
}

export default StatusRequestControllers;
