import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
import NavigationMenu from '../../../models/System/Navbar/NavigationMenu.js';

// Asumiendo que los modelos `NavigationMenu` y `Profile` utilizan la clase BaseModel
class NavigationMenuControllers {
  constructor() {
    this.model = new BaseModel('navigation_menu', 'name_nm');
    this.navMenuModel = new NavigationMenu();
    this.profileModel = new BaseModel('profile', 'name_profile');
    this.nameFieldId = 'id_nm';
    this.nameFieldToSearch = 'name_nm';
  }

  async getNavigationMenus(req, res) {
    const { limit, offset, order, typeOrder, filters } = req.body;

    try {
      const queryResponse = await this.model.getAllPaginationWhere(limit, offset, order, typeOrder, filters);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay tipos de menú de navegación disponibles',
        });
      }

      return res.status(200).json({
        message: 'Tipos de menú de navegación obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getNavigationMenu(req, res) {
    const { value_nm } = req.body;
    try {
      if (isInputEmpty(value_nm)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de tipo de menú de navegación son inválidos');
      }

      const queryResponse = await this.model.getOne(value_nm, this.nameFieldToSearch);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el tipo de menú de navegación');
      }

      return res.status(200).json({
        message: 'Tipo de menú de navegación obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createNavigationMenu(req, res) {
    const { name_nm } = req.body;
    try {
      if (isInputEmpty(name_nm)) {
        throw new Error('Debes completar todos los campos');
      }
      if (isNotAToZ(name_nm)) {
        throw new Error('El tipo de menú de navegación no debe contener caracteres especiales');
      }

      const checkExists = await this.model.getOne(name_nm, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        throw new Error('Tipo de menú de navegación ya existente');
      }

      const queryResponse = await this.model.createOne({ name_nm });
      if (!queryResponse) {
        throw new Error('Error al crear tipo de menú de navegación');
      }

      return res.status(200).json({
        message: 'Tipo de menú de navegación creado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async updateNavigationMenu(req, res) {
    const { id_nm, name_nm, status_nm } = req.body;
    try {
      if (isInputEmpty(name_nm)) {
        throw new Error('Debes completar todos los campos');
      }

      if (isNotAToZ(name_nm)) {
        throw new Error('El tipo de menú de navegación no debe contener caracteres especiales');
      }

      if (isNotNumber(id_nm)) {
        throw new Error('Los datos del tipo de menú de navegación son inválidos');
      }

      if (isNotNumber(status_nm)) {
        throw new Error('Los datos de estado del tipo de menú de navegación son inválidos');
      }

      const checkExists = await this.model.getOne(id_nm, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar este tipo de menú de navegación, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ name_nm, status_nm }, [this.nameFieldId, id_nm]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al actualizar datos del menú de navegación');
      }

      return res.status(200).json({
        message: 'Tipo de menú de navegación actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async toggleStatusNavigationMenu(req, res) {
    const { id_nm, status_nm } = req.body;

    try {
      if (isNotNumber(id_nm)) throw new Error('Los datos del tipo de menú de navegación son inválidos');

      const checkExists = await this.model.getOne(id_nm, this.nameFieldId);

      if (checkExists.length < 1) {
        throw new Error('No se puede actualizar el tipo de menú de navegación, debido a que no existe');
      }

      const queryResponse = await this.model.updateOne({ status_nm }, [this.nameFieldId, id_nm]);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al cambiar estado del tipo de menú de navegación');
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async deleteNavigationMenu(req, res) {
    const { id_nm } = req.body;
    try {
      if (isNotNumber(id_nm)) {
        throw new Error('Ha ocurrido un error al eliminar el tipo de menú de navegación, intente reiniciando el sitio');
      }

      const queryResponse = await this.model.deleteOne(id_nm, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        throw new Error('Error al eliminar el tipo de menú de navegación');
      }

      return res.status(200).json({
        message: 'Tipo de menú de navegación eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getMenuParentsByIdProfile(req, res) {
    const { profile_fk } = req.body;

    try {
      const queryResponse = await this.navMenuModel.getMenuParentsByIdProfile(profile_fk)

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay menús de navegación disponibles para el perfil',
        });
      }

      return res.status(200).json({
        message: 'Menús de navegación obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async getMenuChildrensByIdProfileAndIdParent(req, res) {
    const { profile_fk } = req;
    const { id_pm } = req.body;


    try {
      const queryResponse = await this.navMenuModel.getMenuChildrensByIdProfileAndIdParent(profile_fk, id_pm);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay menús de navegación disponibles para el perfil y padre especificado',
        });
      }

      return res.status(200).json({
        message: 'Menús de navegación obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }
}

export default NavigationMenuControllers;
