import BaseModel from '../../models/BaseModel.js';

import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';



class SubjectTypeControllers {
  constructor() {
    this.model = new BaseModel('subject_message', 'name_sm');
    this.nameFieldId = "id_sm"
    this.nameFieldToSearch = "name_sm"
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de asunto de mensaje, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_sm', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de asunto de mensaje disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de asunto de mensaje obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de asunto de mensaje: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de asunto de mensaje",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_sm', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de asunto de mensaje, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de asunto de mensaje obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de asunto de mensaje: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de asunto de mensaje",
      });
    }
  }

  async getOne(req, res) {
    const { value_sm } = req.body;
    try {
      if (isInputEmpty(value_sm)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de asunto de mensaje son inválidos');
      }

      const queryResponse = await this.model.getOne(value_sm, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de asunto de mensaje');
      }

      return res.status(200).json({
        message: 'Tipo de asunto de mensaje obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de asunto de mensaje: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_sm } = req.body;
    try {
      if (isInputEmpty(name_sm)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_sm)) {
        return res.status(403).json({
          message: "El tipo de asunto de mensaje no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_sm, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de asunto de mensaje ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_sm });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de asunto de mensaje"
        })
      }

      return res.status(200).json({
        message: 'Tipo de asunto de mensaje creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de asunto de mensaje: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de asunto de mensaje",
      });
    }
  }

  async updateOne(req, res) {
    const { id_sm, name_sm, status_sm } = req.body;
    try {
      if (isInputEmpty(name_sm)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_sm)) {
        return res.status(403).json({
          message: "El tipo de asunto de mensaje no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_sm)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de asunto de mensaje son inválidos"
        })
      }

      if (isNotNumber(status_sm)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de asunto de mensaje son inválidos"
        })
      }

      if (isNotAToZ(name_sm)) {
        return res.status(403).json({
          message: "El tipo de asunto de mensaje no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_sm, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de asunto de mensaje, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_sm, 'name_sm');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_sm != id_sm) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_sm, status_sm }, [this.nameFieldId, id_sm]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de asunto de mensaje",
        });
      }

      return res.status(200).json({
        message: 'Tipo de asunto de mensaje actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de asunto de mensaje: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de asunto de mensaje",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_sm } = req.body;
    try {

      if (isNotNumber(id_sm)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de asunto de mensaje, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_sm, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de asunto de mensaje, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de asunto de mensaje eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de asunto de mensaje: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de asunto de mensaje, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_sm, status_sm } = req.body;
    try {

      if (isNotNumber(id_sm)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de asunto de mensaje son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_sm, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de asunto de mensaje, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_sm }, [this.nameFieldId, id_sm]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de asunto de mensaje",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de asunto de mensaje: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de asunto de mensaje",
      });
    }
  }

}

export default SubjectTypeControllers