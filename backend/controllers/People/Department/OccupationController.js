import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

class OccupationControllers {
  constructor() {
    this.model = new BaseModel('occupation', 'name_occupation');
    this.nameFieldId = "id_occupation";
    this.nameFieldToSearch = "name_occupation";
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de puesto de trabajo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_occupation', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de puesto de trabajo disponibles',
          total: 0
        });
      }

      return res.status(200).json({
        message: 'Tipos de puesto de trabajo obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de puesto de trabajo",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_occupation', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de puesto de trabajo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de puesto de trabajo obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de puesto de trabajo",
      });
    }
  }

  async getOne(req, res) {
    const { value_occupation } = req.body;
    try {
      if (isInputEmpty(value_occupation)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de puesto de trabajo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_occupation, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el puesto de trabajo');
      }

      return res.status(200).json({
        message: 'Tipo de puesto de trabajo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_occupation, salary_occupation } = req.body;

    console.log(req.body);
    try {
      if (isInputEmpty(name_occupation) || isInputEmpty(salary_occupation)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotNumber(salary_occupation)) {
        return res.status(422).json({
          message: "El salario debe estar expresado en numeros"
        })
      }

      if (isNotAToZ(name_occupation)) {
        return res.status(422).json({
          message: "El puesto de trabajo no puede contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_occupation, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Ya existe un puesto de trabajo con este nombre, por favor ingrese uno distinto"
        })
      }

      const queryResponse = await this.model.createOne({ name_occupation, salary_occupation });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de puesto de trabajo"
        })
      }

      return res.status(200).json({
        message: 'puesto de trabajo creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de puesto de trabajo",
      });
    }
  }

  async updateOne(req, res) {
    const { id_occupation, name_occupation, salary_occupation, status_occupation } = req.body;
    try {
      if (isInputEmpty(id_occupation) || isInputEmpty(name_occupation) || isInputEmpty(salary_occupation) || isInputEmpty(status_occupation)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotNumber(salary_occupation)) {
        return res.status(422).json({
          message: "El salario debe estar expresado en formato numerico"
        })
      }

      if (isNotAToZ(name_occupation)) {
        return res.status(422).json({
          message: "El puesto de trabajo no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(status_occupation)) {
        return res.status(403).json({
          message: "Los datos de estado del puesto de trabajo son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_occupation, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de puesto de trabajo, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_occupation, 'name_occupation');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_occupation != id_occupation) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_occupation, status_occupation }, [this.nameFieldId, id_occupation]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de puesto de trabajo",
        });
      }

      return res.status(200).json({
        message: 'Tipo de puesto de trabajo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de puesto de trabajo",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_occupation } = req.body;
    try {

      if (isNotNumber(id_occupation)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de puesto de trabajo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_occupation, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de puesto de trabajo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de puesto de trabajo eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de puesto de trabajo: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de puesto de trabajo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }

}

export default OccupationControllers;
