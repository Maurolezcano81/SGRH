import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';

class NacionalityController {
  constructor() {
    this.model = new BaseModel('nacionality', 'name_nacionality');
    this.nameFieldId = 'id_nacionality';
    this.nameFieldToSearch = 'name_nacionality';
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de tipo de nacionalidad, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_nacionality', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de tipo de nacionalidad disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de tipo de nacionalidad obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de tipo de nacionalidad",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_nacionality', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de tipo de nacionalidad, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de tipo de nacionalidad obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de tipo de nacionalidad",
      });
    }
  }

  async getOne(req, res) {
    const { value_nacionality } = req.body;
    try {
      if (isInputEmpty(value_nacionality)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de tipo de nacionalidad son inválidos');
      }

      const queryResponse = await this.model.getOne(value_nacionality, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de nacionalidad');
      }

      return res.status(200).json({
        message: 'Tipo de tipo de nacionalidad obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_nacionality, abbreviation_nacionality } = req.body;

    console.log(req.body);
    try {
      if (isInputEmpty(name_nacionality) || isInputEmpty(abbreviation_nacionality)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(abbreviation_nacionality)) {
        return res.status(422).json({
          message: "El tipo de nacionalidad no puede contener caracteres especiales"
        })
      }

      if (isNotAToZ(name_nacionality)) {
        return res.status(422).json({
          message: "El tipo de nacionalidad no puede contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_nacionality, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Ya existe un tipo de nacionalidad con este nombre, por favor ingrese uno distinto"
        })
      }

      const checkExistsAbbr = await this.model.getOne(abbreviation_nacionality, 'abbreviation_nacionality');

      if (checkExistsAbbr && checkExistsAbbr.length > 0) {
        return res.status(403).json({
          message: "Este tipo abreviación ya esta asociado a un tipo de nacionalidad, por favor ingrese uno distinto"
        })
      }

      const queryResponse = await this.model.createOne({ name_nacionality, abbreviation_nacionality });

      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de tipo de nacionalidad"
        })
      }

      return res.status(200).json({
        message: 'tipo de nacionalidad creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de tipo de nacionalidad",
      });
    }
  }

  async updateOne(req, res) {
    const { id_nacionality, name_nacionality, abbreviation_nacionality, status_nacionality } = req.body;
    try {
      if (isInputEmpty(id_nacionality) || isInputEmpty(name_nacionality) || isInputEmpty(abbreviation_nacionality) || isInputEmpty(status_nacionality)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(abbreviation_nacionality)) {
        return res.status(422).json({
          message: "El tipo de nacionalidad no puede contener caracteres especiales"
        })
      }

      if (isNotAToZ(name_nacionality)) {
        return res.status(422).json({
          message: "El tipo de nacionalidad no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(status_nacionality)) {
        return res.status(403).json({
          message: "Los datos de estado del tipo de nacionalidad son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_nacionality, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de tipo de nacionalidad, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_nacionality, 'name_nacionality');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_nacionality != id_nacionality) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const checkDuplicateAbbr = await this.model.getOne(abbreviation_nacionality, 'abbreviation_nacionality');

      if (checkDuplicateAbbr.length > 0) {
        if (checkDuplicateAbbr[0].id_nacionality != id_nacionality) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que esta abreviacion ya existe en un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_nacionality, abbreviation_nacionality, status_nacionality }, [this.nameFieldId, id_nacionality]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de tipo de nacionalidad",
        });
      }

      return res.status(200).json({
        message: 'Tipo de tipo de nacionalidad actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de tipo de nacionalidad",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_nacionality } = req.body;
    try {

      if (isNotNumber(id_nacionality)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de tipo de nacionalidad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_nacionality, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de tipo de nacionalidad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de tipo de nacionalidad eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de tipo de nacionalidad: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de tipo de nacionalidad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }
}

export default NacionalityController;
