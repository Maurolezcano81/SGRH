import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../../middlewares/Validations.js';

class ContactController {
  constructor() {
    this.model = new BaseModel('contact', 'name_contact');
    this.nameFieldId = 'id_contact';
    this.nameFieldToSearch = 'name_contact';
    this.entityContact = new BaseModel('entity_contact', 'id_ec')
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de contacto, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_contact', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de contacto disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de contacto obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de contacto: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de contacto",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_contact', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de contacto, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de contacto obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de contacto: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de contacto",
      });
    }
  }

  async getOne(req, res) {
    const { value_contact } = req.body;
    try {
      if (isInputEmpty(value_contact)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de contacto son inválidos');
      }

      const queryResponse = await this.model.getOne(value_contact, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de contacto');
      }

      return res.status(200).json({
        message: 'Tipo de contacto obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de contacto: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_contact } = req.body;
    try {
      if (isInputEmpty(name_contact)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_contact)) {
        return res.status(403).json({
          message: "El tipo de contacto no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_contact, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de contacto ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_contact });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de contacto"
        })
      }

      return res.status(200).json({
        message: 'Tipo de contacto creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de contacto: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de contacto",
      });
    }
  }

  async updateOne(req, res) {
    const { id_contact, name_contact, status_contact } = req.body;
    try {
      if (isInputEmpty(name_contact)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_contact)) {
        return res.status(403).json({
          message: "El tipo de contacto no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_contact)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de contacto son inválidos"
        })
      }

      if (isNotNumber(status_contact)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de contacto son inválidos"
        })
      }

      if (isNotAToZ(name_contact)) {
        return res.status(403).json({
          message: "El tipo de contacto no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_contact, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de contacto, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_contact, 'name_contact');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_contact != id_contact) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_contact, status_contact }, [this.nameFieldId, id_contact]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de contacto",
        });
      }

      return res.status(200).json({
        message: 'Tipo de contacto actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de contacto: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de contacto",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_contact } = req.body;
    try {

      if (isNotNumber(id_contact)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de contacto, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_contact, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de contacto, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de contacto eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de contacto: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de contacto, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_contact, status_contact } = req.body;
    try {

      if (isNotNumber(id_contact)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de contacto son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_contact, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de contacto, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_contact }, [this.nameFieldId, id_contact]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de contacto",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de contacto: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de contacto",
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

export default ContactController;
