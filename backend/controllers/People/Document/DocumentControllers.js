import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
class DocumentControllers {
  constructor() {
    this.model = new BaseModel('document', 'name_document');
    this.nameFieldId = "id_document";
    this.nameFieldToSearch = "name_document";
    this.entityDocument = new BaseModel('entity_document', 'value_ed');
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de documento, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_document', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de documento disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de documento obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de Documento",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_document', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de documento, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de documento obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de Documento",
      });
    }
  }

  async getOne(req, res) {
    const { value_document } = req.body;
    try {
      if (isInputEmpty(value_document)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de documento son inválidos');
      }

      const queryResponse = await this.model.getOne(value_document, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el documento');
      }

      return res.status(200).json({
        message: 'Tipo de documento obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_document } = req.body;
    try {
      if (isInputEmpty(name_document)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_document)) {
        return res.status(422).json({
          message: "El documento no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_document, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de documento ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_document });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de documento"
        })
      }

      return res.status(200).json({
        message: 'Documento creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de Documento",
      });
    }
  }

  async updateOne(req, res) {
    const { id_document, name_document, status_document } = req.body;
    try {
      if (isInputEmpty(name_document)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_document)) {
        return res.status(422).json({
          message: "El documento no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_document)) {
        return res.status(403).json({
          message: "Los datos de estado del documento son inválidos"
        })
      }

      if (isNotNumber(status_document)) {
        return res.status(403).json({
          message: "Los datos de estado del documento son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_document, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de documento, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_document, 'name_document');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_document != id_document) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_document, status_document }, [this.nameFieldId, id_document]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Documento",
        });
      }

      return res.status(200).json({
        message: 'Tipo de documento actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de Documento",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_document } = req.body;
    try {

      if (isNotNumber(id_document)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de documento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_document, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de documento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de documento eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de documento, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_document, status_document } = req.body;
    try {

      if (isNotNumber(id_document)) {
        return res.status(403).json({
          message: "Los datos de estado del documento son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_document, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de documento, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_document }, [this.nameFieldId, id_document]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Documento",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de Documento",
      });
    }
  }

  async updateEntityDocument(req, res) {
    const { id_ed, entity_fk, value_ed, document_fk } = req.body;
    try {
      const queryResponse = await this.entityDocument.updateOne({ value_ed, document_fk }, ['id_ed', id_ed]);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "No se ha podido actualizar"
        })
      }

      return res.status(200).json({
        message: "Actualizado correctamente",
        queryResponse
      })
    } catch (error) {
      console.error('Error en controlador de documento: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteEntityDocument(req, res) {
    const { id_ed } = req.body;

    try {
      const queryResponse = await this.entityDocument.deleteOne(id_ed, 'id_ed');

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

  async createEntityDocument(req, res) {
    const { entity_fk, value_ed, document_fk } = req.body;

    try {
      const queryResponse = await this.entityDocument.createOne({ entity_fk, value_ed, document_fk });

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

export default DocumentControllers;
