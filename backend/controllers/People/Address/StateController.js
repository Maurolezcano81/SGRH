import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';
import StateModel from '../../../models/Address/StateModel.js';

class StateControllers {
  constructor() {
    this.model = new StateModel()
    this.countryModel = new BaseModel('country', 'name_country');
    this.nameFieldId = "id_state";
    this.nameFieldToSearch = "name_state";

    this.city = new BaseModel("city", 'id_city')
  }

  async getAll(req, res) {
    const { limit, offset, order, orderBy, filters } = req.body;
    const { id_country } = req.params;

    try {
      const list = await this.model.getStatesByCountry(id_country, limit, offset, orderBy, order, filters)

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los datos de las provincias, intentelo reiniciando el sitio',
        });
      }

      const getTotalResults = await this.model.getTotalStatesByCountry(id_country, filters);

      if (list.length < 1) {
        return res.status(200).json({
          message: 'No hay provincias disponibles',
          total: 0,
          list: []
        });
      }


      if (!getTotalResults) {
        return res.status(200).json({
          message: 'No hay provincias disponibles',
          total: 0,
          list: []
        });
      }

      return res.status(200).json({
        message: 'Provincias obtenidas correctamente',
        list: list,
        total: getTotalResults?.total || 0
      });

    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(500).json({
        message: 'No se pudo obtener los datos de las provincias, intentelo reiniciando el sitio',
      });
    }
  }

  async getActives(req, res) {
    const { country_fk } = req.body;
    try {
      if (isInputEmpty(country_fk)) {
        return res.status(500).json({
          message: 'Los datos que estás utilizando para la búsqueda de provincia son inválidos'
        })
      }

      const queryResponse = await this.model.getStatesActivesByCountry(country_fk);

      if (!queryResponse) {
        return res.status(500).json({
          message: 'Error al obtener las provincias'
        })
      }

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: "Obtenido exitosamente",
          queryResponse: []
        })
      }

      return res.status(200).json({
        message: 'Provincias obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(500).json({
        message: 'Error al obtener las provincias'
      });
    }
  }

  async getOne(req, res) {
    const { value_state } = req.body;
    try {
      if (isInputEmpty(value_state)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de provincia son inválidos');
      }

      const queryResponse = await this.model.getOne(value_state, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el sexo');
      }

      return res.status(200).json({
        message: 'Tipo de provincia obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_state, arrayCities } = req.body;

    try {
      if (isInputEmpty(name_state)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_state)) {
        return res.status(422).json({
          message: "La provincia no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOneByCountryAndNameState(id_country, name_state);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Este nombre  de provincia ya existe en este país"
        })
      }

      if (arrayCities.length < 1) {
        return res.status(403).json({
          message: "Debes agregar al menos una ciudad"
        })
      }

      const queryResponse = await this.model.createOne(
        {
          name_state: name_state,
          country_fk: id_country
        }
      );


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de provincia"
        })
      }


      for (const city of arrayCities) {

        const insertCities = await this.city.createOne({
          name_city: city,
          state_fk: queryResponse.lastId
        });

        if (!insertCities) {
          return res.status(403).json({
            message: "Ha ocurrido un error al agregar las ciudades"
          })
        }
      }



      return res.status(200).json({
        message: 'Provincia creada exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de Provincia",
      });
    }
  }

  async updateOne(req, res) {
    const { id_state, name_state , status_state } = req.body;
    try {
      if (isInputEmpty(name_state)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_state)) {
        return res.status(422).json({
          message: "El sexo no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_state)) {
        return res.status(403).json({
          message: "Los datos de estado de la provincia son inválidos"
        })
      }

      if (isNotNumber(status_state)) {
        return res.status(403).json({
          message: "Los datos de estado de la provincia son inválidos"
        })
      }

      if (isNotAToZ(name_state)) {
        return res.status(422).json({
          message: "El sexo no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(id_state, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de provincia, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_state, 'name_state');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_state != id_state) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_state, status_state }, [this.nameFieldId, id_state]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Provincia",
        });
      }

      return res.status(200).json({
        message: 'Tipo de provincia actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de Provincia",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_state } = req.body;
    try {

      if (isNotNumber(id_state)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de provincia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_state, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de provincia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de provincia eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de provincia: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de provincia, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }

}

export default StateControllers;
