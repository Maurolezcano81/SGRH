import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class AttachmentControllers {
  constructor() {
    this.model = new BaseModel('type_attachment', 'name_ta');
    this.nameFieldId = "id_ta";
    this.nameFieldToSearch = "name_ta";
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de anexo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_ta', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de anexo disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de anexo obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de anexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de anexo",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_ta', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de anexo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de anexo obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de anexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de anexo",
      });
    }
  }

  async getOne(req, res) {
    const { value_ta } = req.body;
    try {
      if (isInputEmpty(value_ta)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de anexo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_ta, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el anexo');
      }

      return res.status(200).json({
        message: 'Tipo de anexo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de anexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_ta } = req.body;
    try {
      if (isInputEmpty(name_ta)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_ta)) {
        return res.status(403).json({
          message: "El anexo no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_ta, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de anexo ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_ta });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de anexo"
        })
      }

      return res.status(200).json({
        message: 'anexo creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de anexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de anexo",
      });
    }
  }

  async updateOne(req, res) {
    const { id_ta, name_ta, status_ta } = req.body;
    try {
      if (isInputEmpty(name_ta)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_ta)) {
        return res.status(403).json({
          message: "El anexo no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_ta)) {
        return res.status(403).json({
          message: "Los datos de estado del anexo son inválidos"
        })
      }

      if (isNotNumber(status_ta)) {
        return res.status(403).json({
          message: "Los datos de estado del anexo son inválidos"
        })
      }

      if (isNotAToZ(name_ta)) {
        return res.status(403).json({
          message: "El anexo no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_ta, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de anexo, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_ta, 'name_ta');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_ta != id_ta) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_ta, status_ta }, [this.nameFieldId, id_ta]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de anexo",
        });
      }

      return res.status(200).json({
        message: 'Tipo de anexo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de anexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de anexo",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_ta } = req.body;
    try {

      if (isNotNumber(id_ta)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de anexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_ta, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de anexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de anexo eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de anexo: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de anexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_ta, status_ta } = req.body;
    try {

      if (isNotNumber(id_ta)) {
        return res.status(403).json({
          message: "Los datos de estado del anexo son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_ta, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de anexo, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_ta }, [this.nameFieldId, id_ta]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de anexo",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de anexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de anexo",
      });
    }
  }
}

export default AttachmentControllers;
