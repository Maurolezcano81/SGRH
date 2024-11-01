import BaseModel from '../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class SexControllers {
  constructor() {
    this.model = new BaseModel('sex', 'name_sex');
    this.nameFieldId = 'id_sex';
    this.nameFieldToSearch = 'name_sex';
    this.defaultOrderBy = 'name_sex'
  }

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de sexo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_sex', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de sexo disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de sexo obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de Sexo",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_sex', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los tipos de sexo, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      return res.status(200).json({
        message: 'Tipos de sexo obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los tipos de Sexo",
      });
    }
  }

  async getOne(req, res) {
    const { value_sex } = req.body;
    try {
      if (isInputEmpty(value_sex)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de sexo son inválidos');
      }

      const queryResponse = await this.model.getOne(value_sex, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el sexo');
      }

      return res.status(200).json({
        message: 'Tipo de sexo obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_sex } = req.body;
    try {
      if (isInputEmpty(name_sex)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_sex)) {
        return res.status(422).json({
          message: "El sexo no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_sex, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Tipo de sexo ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_sex });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el tipo de sexo"
        })
      }

      return res.status(200).json({
        message: 'Sexo creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el tipo de Sexo",
      });
    }
  }

  async updateOne(req, res) {
    const { id_sex, name_sex, status_sex } = req.body;
    try {
      if (isInputEmpty(name_sex)) {
        return res.status(422).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_sex)) {
        return res.status(422).json({
          message: "El sexo no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_sex)) {
        return res.status(403).json({
          message: "Los datos de estado del sexo son inválidos"
        })
      }

      if (isNotNumber(status_sex)) {
        return res.status(403).json({
          message: "Los datos de estado del sexo son inválidos"
        })
      }

      if (isNotAToZ(name_sex)) {
        return res.status(422).json({
          message: "El sexo no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(id_sex, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de sexo, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_sex, 'name_sex');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_sex != id_sex) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_sex, status_sex }, [this.nameFieldId, id_sex]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Sexo",
        });
      }

      return res.status(200).json({
        message: 'Tipo de sexo actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el tipo de Sexo",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_sex } = req.body;
    try {

      if (isNotNumber(id_sex)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de sexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_sex, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el tipo de sexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Tipo de sexo eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el tipo de sexo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_sex, status_sex } = req.body;
    try {

      if (isNotNumber(id_sex)) {
        return res.status(403).json({
          message: "Los datos de estado del sexo son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_sex, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este tipo de sexo, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_sex }, [this.nameFieldId, id_sex]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el tipo de Sexo",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de sexo: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del tipo de Sexo",
      });
    }
  }
}

export default SexControllers;
