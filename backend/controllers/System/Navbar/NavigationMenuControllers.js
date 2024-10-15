import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
import NavigationMenu from '../../../models/System/Navbar/NavigationMenu.js';
import PerformanceModel from '../../../models/Quiz/Performance/Performance.js';
// Asumiendo que los modelos `NavigationMenu` y `Profile` utilizan la clase BaseModel
class NavigationMenuControllers {
  constructor() {
    this.model = new BaseModel('navigation_menu', 'name_nm');
    this.navMenuModel = new NavigationMenu();
    this.profileModel = new BaseModel('profile', 'name_profile');
    this.performance = new PerformanceModel();
    this.nameFieldId = 'id_nm';
    this.nameFieldToSearch = 'name_nm';

    this.module = new BaseModel('module', 'name_module');

    this.parentMenu = new BaseModel('parent_menu', 'order_pm');

    this.parentChildren = new BaseModel('module_parent', 'order_mp')
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
      return res.status(500).json({
        message: "Ha ocurrido un error, intente reiniciando el sitio",
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
    const {profile_fk} = req
    const { id_user } = req;

    console.log(profile_fk)

    try {
      const queryResponse = await this.navMenuModel.getMenuParentsByIdProfile(profile_fk)

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay menús de navegación disponibles para el perfil',
        });
      }

      let isSupervisorEp;

      const CheckIfIsSupervisor = await this.performance.isSupervisorInSomeQuiz(id_user);

      if (CheckIfIsSupervisor.length < 1) {
        isSupervisorEp = false;
      } else {
        isSupervisorEp = true;
      }

      return res.status(200).json({
        message: 'Menús de navegación obtenidos correctamente',
        queryResponse,
        isSupervisorEp
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
          queryResponse: []
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

  async getMenuParentsByIdMenu(req, res) {
    const { id_nm } = req.body;

    try {
      const queryResponse = await this.navMenuModel.getMenuParentsByIdMenu(id_nm)

      if (isInputEmpty(id_nm)) {
        return res.status(200).json({
          message: 'No hay menús de navegación disponibles para el perfil',
          queryResponse: []
        });
      }

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay menús de navegación disponibles para el perfil',
          queryResponse: []
        });
      }


      return res.status(200).json({
        message: 'Menús de navegación obtenidos correctamente',
        queryResponse: queryResponse
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al cargar los datos, intentelo nuevamente más adelante",
      });
    }
  }

  async getMenuChildrensByIdParent(req, res) {
    const { id_pm } = req.body;

    try {
      const queryResponse = await this.navMenuModel.getMenuChildrensByIdParent(id_pm);

      if (queryResponse.length < 1) {
        return res.status(200).json({
          message: 'No hay modulos disponibles para este item',
          queryResponse: []
        });
      }

      return res.status(200).json({
        message: 'Menús de navegación obtenidos correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al cargar los datos, intentelo nuevamente más adelante",
      });
    }
  }


  async createChildrenParent(req, res) {
    const { pm_fk, module_fk, order_mp } = req.body;

    try {

      if (isInputEmpty(pm_fk) || isInputEmpty(module_fk) || isInputEmpty(order_mp)) {

        return res.status(403).json({
          message: "Ha ocurrido un error al agregar la página de navegación, intentelo nuevamente más adelante"
        })
      }

      const queryResponse = await this.parentChildren.createOne({
        pm_fk: pm_fk,
        module_fk: module_fk,
        order_mp: order_mp
      })

      console.log(queryResponse)

      if (!queryResponse) {
        return res.status(403).json({
          message: "Ha ocurrido un error al agregar la página de navegación",
        })
      }

      return res.status(200).json({
        message: 'Se agrego correctamente la pagina de navegación al menú desplegable',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al agregar la página de navegación",
      });
    }
  }

  async deleteChildrenParent(req, res) {
    const { id_mp } = req.body;

    try {

      if (isInputEmpty(id_mp) || isNotNumber(id_mp)) {
        return res.status(403).json({
          message: "Ha ocurrido un error al desvincular la página de navegación, intentelo nuevamente más adelante"
        })
      }

      const deleteChildren = await this.parentChildren.deleteOne(id_mp, 'id_mp');

      if (deleteChildren.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha ocurrido un error al desvincular la página de navegación, intentelo nuevamente más adelante"
        })
      }

      return res.status(200).json({
        message: "La página de navegación ha sido desvinculada correctamente"
      })

    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al agregar la página de navegación",
      });
    }

  }


  async getChildrensToAdd(req, res) {
    const { limit, offset, orderBy, typeOrder, filters } = req.body;
    const { id_nm } = req.params;

    try {
      const getAllChildrensInMenu = await this.navMenuModel.getAllIdModulesInMenu(id_nm);

      let arrayToExclude = [];

      getAllChildrensInMenu.forEach((item) => {
        arrayToExclude.push(item.id_module);
      })

      const list = await this.navMenuModel.getChildrensToAdd(id_nm, limit, offset, orderBy, typeOrder, filters, arrayToExclude);

      const getTotalResults = await this.navMenuModel.getTotalChildrensToAdd(id_nm, limit, offset, orderBy, typeOrder, filters, arrayToExclude);

      if (list.length < 1) {
        console.log("No se encontraron usuarios.");
        return res.status(403).json({
          message: "No se encontraron usuarios",
          list: [],
          total: 0
        });
      }

      res.status(200).json({
        message: "Usuarios obtenidos correctamente",
        list: list,
        total: getTotalResults[0]?.total || 0
      })

    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al agregar la página de navegación",
      });
    }
  }

  async createParentMenu(req, res) {
    const { name_pm, nm_fk, order_pm } = req.body;

    console.log(req.body)
    try {

      if (isInputEmpty(name_pm) || isInputEmpty(nm_fk) || isInputEmpty(order_pm)) {
        return res.status(403).json({
          message: "Ha ocurrido un error al agregar el menú desplegable, intente reiniciando el sitio"
        })
      }

      if (isNotAToZ(name_pm)) {
        return res.status(403).json({
          message: "Introduzca datos validos en el nombre del menú desplegable"
        })
      }


      const checkExistsName = await this.navMenuModel.getParentMenuByNameAndNavMenuId(name_pm, nm_fk);

      if (checkExistsName.length > 0) {
        return res.status(403).json({
          message: "Este menú desplegable ya existe en este menú de navegación, introduzca uno distinto"
        })
      }

      const createParentMenu = await this.parentMenu.createOne({
        name_pm: name_pm,
        nm_fk: nm_fk,
        order_pm: order_pm
      })

      if (!createParentMenu) {
        return res.status(200).json({
          message: "Ha ocurrido un error al agregar el menú desplegable, intente reiniciando el sitio"
        })
      };


      return res.status(200).json({
        message: "El menú desplegable ha sido creado exitosamente",
        queryResponse: createParentMenu
      })
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al agregar el menú desplegable",
      });
    }
  }


  async deleteParentMenu(req, res) {
    const { id_pm } = req.body;
    try {
      if (isInputEmpty(id_pm) || isNotNumber(id_pm)) {
        return res.status(403).json({
          message: "Ha ocurrido un error al desvincular el menú desplegable, intentelo nuevamente más adelante"
        })
      }

      const deleteParent = await this.parentMenu.deleteOne(id_pm, 'id_pm');

      if (deleteParent.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha ocurrido un error al desvincular el menú desplegable, intentelo nuevamente más adelante"
        })
      }

      return res.status(200).json({
        message: "El menú ha sido desvinculado correctamente"
      })

    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al agregar el menú desplegable",
      });
    }
  }

  async updateParentMenu(req, res) {
    const { id_pm, name_pm, order_pm, nm_fk } = req.body;


    try {
      if (isInputEmpty(name_pm) || isInputEmpty(order_pm)) {
        return res.status(403).json({
          message: "Ha ocurrido un error al modificar el menú desplegable, intentelo nuevamente más adelante"
        })
      }

      if (isNotAToZ(name_pm)) {
        return res.status(403).json({
          message: "El menú desplegable no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.navMenuModel.getParentMenuByNameAndNavMenuId(name_pm, nm_fk);

      if (checkExists) {
        if (checkExists[0].name_pm === name_pm && checkExists[0].id_pm === id_pm) {
          const updateOne = await this.navMenuModel.updateOne({
            name_pm: name_pm,
            order_pm: order_pm
          }, ['id_pm', id_pm])

          if (updateOne.affectedRows < 1) {
            return res.status(403).json({
              message: "Ha ocurrido un error al modificar el menú desplegable, intentelo nuevamente más adelante"
            })
          }

          return res.status(200).json({
            message: "El menú desplegable ha sido actualizado correctamente"
          })
        } else {
          return res.status(403).json({
            message: "Ha ocurrido un error al modificar el menú desplegable, intentelo nuevamente más adelante"
          })
        }
      } else {
        return res.status(403).json({
          message: "Ha ocurrido un error al modificar el menú desplegable, intentelo nuevamente más adelante"
        })
      }
    } catch (error) {
      console.error('Error en controlador de menú de navegación por perfil y padre: ' + error);
      return res.status(500).json({
        message: "Ha ocurrido un error al modificar el menú desplegable",
      });
    }

  }
}

export default NavigationMenuControllers;
