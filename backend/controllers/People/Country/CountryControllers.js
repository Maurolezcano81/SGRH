import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../../middlewares/Validations.js';
import StateModel from '../../../models/Address/StateModel.js';

class CountryController {
  constructor() {
    this.model = new BaseModel('country', 'id_country');
    this.nameFieldId = 'id_country';
    this.nameFieldToSearch = 'name_country';
    this.state = new StateModel()
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de país, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_country', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de país disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de país obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de país",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_country', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de país, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de país obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de país",
      });
    }
  }

  async getOne(req, res) {
    const { value_country } = req.body;
    try {
      if (isInputEmpty(value_country)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de país son inválidos');
      }

      const queryResponse = await this.model.getOne(value_country, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el país');
      }

      return res.status(200).json({
        message: 'Tipo de país obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_country, abbreviation_country, arrayStates } = req.body;

    console.log(req.body)

    try {
      if (isInputEmpty(name_country) || isInputEmpty(abbreviation_country)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(abbreviation_country)) {
        return res.status(422).json({
          message: "El país no puede contener caracteres especiales"
        })
      }

      if (isNotAToZ(name_country)) {
        return res.status(422).json({
          message: "El país no puede contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_country, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Ya existe un país con este nombre, por favor ingrese uno distinto"
        })
      }

      const checkExistsAbbr = await this.model.getOne(abbreviation_country, 'abbreviation_country');

      if (checkExistsAbbr && checkExistsAbbr.length > 0) {
        return res.status(403).json({
          message: "Este tipo abreviación ya esta asociado a un país, por favor ingrese uno distinto"
        })
      }

      const queryResponse = await this.model.createOne({ name_country, abbreviation_country });

      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de país"
        })
      }

      for (const state of arrayStates) {

        const insertStates = await this.state.createOne({
          name_state: state,
          country_fk: queryResponse.lastId
        });

        if (!insertStates) {
          return res.status(403).json({
            message: "Ha ocurrido un error al agregar las provincias"
          })
        }
      }


      return res.status(200).json({
        message: 'país creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de país",
      });
    }
  }

  async updateOne(req, res) {
    const { id_country, name_country, abbreviation_country, status_country } = req.body;
    try {
      if (isInputEmpty(id_country) || isInputEmpty(name_country) || isInputEmpty(abbreviation_country) || isInputEmpty(status_country)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(abbreviation_country)) {
        return res.status(422).json({
          message: "El país no puede contener caracteres especiales"
        })
      }

      if (isNotAToZ(name_country)) {
        return res.status(422).json({
          message: "El país no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(status_country)) {
        return res.status(403).json({
          message: "Los datos de estado del país son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_country, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de país, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_country, 'name_country');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_country != id_country) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const checkDuplicateAbbr = await this.model.getOne(abbreviation_country, 'abbreviation_country');

      if (checkDuplicateAbbr.length > 0) {
        if (checkDuplicateAbbr[0].id_country != id_country) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que esta abreviacion ya existe en un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_country, abbreviation_country, status_country }, [this.nameFieldId, id_country]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de país",
        });
      }

      return res.status(200).json({
        message: 'Tipo de país actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de país",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_country } = req.body;
    try {

      if (isNotNumber(id_country)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de país, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_country, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de país, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de país eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de país: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de país, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }
}

export default CountryController;
