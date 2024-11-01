import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class TypeOfTerminationControllers {
  constructor() {
    this.model = new BaseModel('type_of_termination', 'description_tot');
    this.nameFieldId = 'id_tot';
    this.nameFieldToSearch = 'description_tot';
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de terminación, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_tot', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de terminación disponibles',
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
        message: "Ha occurrido un error al obtener los tipos de terminación",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_tot', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de terminación, compruebe su conexión a internet e intente reiniciando el sitio',
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
        message: "Ha occurrido un error al obtener los tipos de terminación",
      });
    }
  }

  async getOne(req, res) {
    const { value_tot } = req.body;
    try {
      if (isInputEmpty(value_tot)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de terminación son inválidos');
      }

      const queryResponse = await this.model.getOne(value_tot, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de terminación');
      }

      return res.status(200).json({
        message: 'Tipo de terminación obtenido correctamente',
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
    const { description_tot } = req.body;
    try {
      if (isInputEmpty(description_tot)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(description_tot)) {
        return res.status(403).json({
          message: "El terminación no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(description_tot, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de terminación ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ description_tot });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de terminación"
        })
      }

      return res.status(200).json({
        message: 'Tipo de terminación creada exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de terminación",
      });
    }
  }

  async updateOne(req, res) {
    const { id_tot, description_tot, status_tot } = req.body;
    try {
      if (isInputEmpty(description_tot)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(description_tot)) {
        return res.status(403).json({
          message: "El terminación no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_tot)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de terminación son inválidos"
        })
      }

      if (isNotNumber(status_tot)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de terminación son inválidos"
        })
      }

      if (isNotAToZ(description_tot)) {
        return res.status(403).json({
          message: "El terminación no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_tot, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de terminación, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(description_tot, 'description_tot');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_tot != id_tot) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ description_tot, status_tot }, [this.nameFieldId, id_tot]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de terminación",
        });
      }

      return res.status(200).json({
        message: 'Tipo de terminación actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de terminación",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_tot } = req.body;
    try {

      if (isNotNumber(id_tot)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de terminación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_tot, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de terminación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de terminación eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de terminación: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de terminación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_tot, status_tot } = req.body;
    try {

      if (isNotNumber(id_tot)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de terminación son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_tot, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de terminación, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_tot }, [this.nameFieldId, id_tot]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de terminación",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de terminación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de terminación",
      });
    }
  }
}

export default TypeOfTerminationControllers;
