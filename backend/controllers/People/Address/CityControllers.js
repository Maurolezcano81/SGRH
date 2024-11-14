import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';
import StateModel from '../../../models/Address/StateModel.js';
import CityModel from '../../../models/Address/CityModel.js';

class StateControllers {
  constructor() {
    this.model = new CityModel()
    this.nameFieldId = "id_city";
    this.nameFieldToSearch = "name_city";

  }

  async getAll(req, res) {
    const { limit, offset, order, orderBy, filters } = req.body;
    const { id_state } = req.params;

    try {
      const list = await this.model.getStatesByCountry(id_state, limit, offset, orderBy, order, filters)

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los datos de las ciudades, intentelo reiniciando el sitio',
        });
      }

      const getTotalResults = await this.model.getTotalStatesByCountry(id_state, filters);

      if (list.length < 1) {
        return res.status(200).json({
          message: 'No hay ciudades disponibles',
          total: 0,
          list: []
        });
      }


      if (!getTotalResults) {
        return res.status(200).json({
          message: 'No hay ciudades disponibles',
          total: 0,
          list: []
        });
      }

      return res.status(200).json({
        message: 'Ciudades obtenidas correctamente',
        list: list,
        total: getTotalResults?.total || 0
      });

    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(500).json({
        message: 'No se pudo obtener los datos de las ciudades, intentelo reiniciando el sitio',
      });
    }
  }

  async getActives(req, res) {
    const { state_fk } = req.body;
    try {
      if (isInputEmpty(state_fk)) {
        return res.status(500).json({
          message: 'Los datos que estás utilizando para la búsqueda de ciudad son inválidos'
        })
      }

      const queryResponse = await this.model.getStatesActivesByCountry(state_fk);

      if (!queryResponse) {
        return res.status(500).json({
          message: 'Error al obtener las ciudades'
        })
      }

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: "Obtenido exitosamente",
          queryResponse: []
        })
      }

      return res.status(200).json({
        message: 'Ciudades obtenidas correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(500).json({
        message: 'Error al obtener las ciudades'
      });
    }
  }

  async getOne(req, res) {
    const { value_city } = req.body;
    try {
      if (isInputEmpty(value_city)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de ciudad son inválidos');
      }

      const queryResponse = await this.model.getOne(value_city, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el ciudad');
      }

      return res.status(200).json({
        message: 'Tipo de ciudad obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { id_state, name_city } = req.body;

    try {
      if (isInputEmpty(name_city)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_city)) {
        return res.status(422).json({
          message: "La ciudad no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOneByStateAndNameCity(id_state, name_city);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Este nombre  de ciudad ya existe en este país"
        })
      }

      const queryResponse = await this.model.createOne(
        {
          name_city: name_city,
          state_fk: id_state
        }
      );

      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de ciudad"
        })
      }

      return res.status(200).json({
        message: 'Ciudad creada exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de Ciudad",
      });
    }
  }

  async updateOne(req, res) {
    const { id_city, name_city, status_city } = req.body;


    
    try {
      if (isInputEmpty(name_city)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_city)) {
        return res.status(422).json({
          message: "El ciudad no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_city)) {
        return res.status(403).json({
          message: "Los datos de estado de la ciudad son inválidos"
        })
      }

      if (isNotNumber(status_city)) {
        return res.status(403).json({
          message: "Los datos de estado de la ciudad son inválidos"
        })
      }

      if (isNotAToZ(name_city)) {
        return res.status(422).json({
          message: "El ciudad no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(id_city, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de ciudad, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_city, 'name_city');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_city != id_city) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_city, status_city }, [this.nameFieldId, id_city]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Ciudad",
        });
      }

      return res.status(200).json({
        message: 'Tipo de ciudad actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de Ciudad",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_city } = req.body;

    try {

      if (isNotNumber(id_city)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de ciudad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_city, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de ciudad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de ciudad eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de ciudad: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de ciudad, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }

}

export default StateControllers;
