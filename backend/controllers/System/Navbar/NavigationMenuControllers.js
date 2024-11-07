import BaseModel from '../../../models/BaseModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber } from '../../../middlewares/Validations.js';
import NavigationMenu from '../../../models/System/Navbar/NavigationMenu.js';
import PerformanceModel from '../../../models/Quiz/Performance/Performance.js';
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

  async getAllWPagination(req, res) {
    try {
      const { limit, offset, order, orderBy, filters } = req.body;

      const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los menues de navegación, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }

      const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_nm', filters)

      if (getTotalResults.length < 1) {
        return res.status(200).json({
          message: 'No hay menues de navegación disponibles',
          total: 0
        });
      }


      return res.status(200).json({
        message: 'Tipos de Menu de Navegación obtenidos correctamente',
        list,
        total: getTotalResults[0].total
      });
    } catch (error) {
      console.error('Error en controlador GetAllWPagination de Menu de Navegación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los menues de navegación",
      });
    }
  }

  async getActives(req, res) {
    try {
      const { filters } = req.body;

      const list = await this.model.getAllPaginationWhereFilteredActives('status_nm', filters);

      if (!list) {
        return res.status(500).json({
          message: 'No se pudo obtener los menues de navegación, compruebe su conexión a internet e intente reiniciando el sitio',
        });
      }

      if (list.length < 1) {
        return res.status(200).json({
          list: []
        });
      }


      return res.status(200).json({
        message: 'Tipos de Menu de Navegación obtenidos correctamente',
        list,
      });
    } catch (error) {
      console.error('Error en controlador GetActives de Menu de Navegación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al obtener los menues de navegación",
      });
    }
  }

  async getOne(req, res) {
    const { value_nm } = req.body;
    try {
      if (isInputEmpty(value_nm)) {
        throw new Error('Los datos que estás utilizando para la búsqueda de menu de navegación son inválidos');
      }

      const queryResponse = await this.model.getOne(value_nm, this.nameFieldId);

      if (queryResponse.length < 1) {
        throw new Error('Error al obtener el menu de navegación');
      }

      return res.status(200).json({
        message: 'Menu de navegación obtenido correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador GetOne de Menu de Navegación: ' + error);
      return res.status(403).json({
        message: error.message,
      });
    }
  }

  async createOne(req, res) {
    const { name_nm } = req.body;
    try {
      if (isInputEmpty(name_nm)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isNotAToZ(name_nm)) {
        return res.status(403).json({
          message: "El menu de navegación no debe contener caracteres especiales"
        })
      }

      const checkExists = await this.model.getOne(name_nm, this.nameFieldToSearch);

      if (checkExists && checkExists.length > 0) {
        return res.status(403).json({
          message: "Menu de navegación ya existente"
        })
      }

      const queryResponse = await this.model.createOne({ name_nm });


      if (!queryResponse) {
        return res.status(500).json({
          message: "Ha ocurrido un error al crear el menu de navegación"
        })
      }

      return res.status(200).json({
        message: 'Menu de navegación creado exitosamente',
        queryResponse,
      });

    } catch (error) {
      console.error('Error en controlador CreateOne de Menu de Navegación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al crear el menu de navegación",
      });
    }
  }

  async updateOne(req, res) {
    const { id_nm, name_nm, status_nm } = req.body;
    try {
      if (isInputEmpty(name_nm)) {
        return res.status(403).json({
          message: "Debes completar todos los campos"
        })
      }

      if (isInputEmpty(name_nm)) {
        return res.status(403).json({
          message: "El menu de navegación no debe contener caracteres especiales"
        })
      }

      if (isNotNumber(id_nm)) {
        return res.status(403).json({
          message: "Los datos de estado del menu de navegación son inválidos"
        })
      }

      if (isNotNumber(status_nm)) {
        return res.status(403).json({
          message: "Los datos de estado del menu de navegación son inválidos"
        })
      }

      if (isNotAToZ(name_nm)) {
        return res.status(403).json({
          message: "El menu de navegación no debe contener caracteres especiales"
        })
      }
      const checkExists = await this.model.getOne(id_nm, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este menu de navegación, debido a que no existe'
        })
      }

      const checkDuplicate = await this.model.getOne(name_nm, 'name_nm');

      if (checkDuplicate.length > 0) {
        if (checkDuplicate[0].id_nm != id_nm) {
          return res.status(403).json({
            message: 'No se puede actualizar, debido a que ya es un registro existente'
          })
        }
      }

      const queryResponse = await this.model.updateOne({ name_nm, status_nm }, [this.nameFieldId, id_nm]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el menu de navegación",
        });
      }

      return res.status(200).json({
        message: 'Menu de navegación actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador UpdateOne de Menu de Navegación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el menu de navegación",
      });
    }
  }

  async deleteOne(req, res) {
    const { id_nm } = req.body;
    try {

      if (isNotNumber(id_nm)) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el menu de navegación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      const queryResponse = await this.model.deleteOne(id_nm, this.nameFieldId);

      if (queryResponse.affectedRows < 1) {
        return res.status(403).json({
          message: "Ha occurrido un error al eliminar el menu de navegación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
        })
      }

      return res.status(200).json({
        message: 'Menu de navegación eliminado exitosamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador DeleteOne de Menu de Navegación: ' + error);
      return res.status(403).json({
        message: "Ha occurrido un error al eliminar el menu de navegación, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
      });
    }
  }


  async toggleStatus(req, res) {
    const { id_nm, status_nm } = req.body;
    try {

      if (isNotNumber(id_nm)) {
        return res.status(403).json({
          message: "Los datos de estado del menu de navegación son inválidos"
        })
      }

      const checkExists = await this.model.getOne(id_nm, this.nameFieldId);

      if (checkExists.length < 1) {
        return res.status(403).json({
          message: 'No se puede actualizar este menu de navegación, debido a que no existe'
        })
      }

      const queryResponse = await this.model.updateOne({ status_nm }, [this.nameFieldId, id_nm]);

      if (queryResponse.affectedRows < 1) {
        return res.status(500).json({
          message: "Ha occurrido un error al actualizar el menu de navegación",
        });
      }

      return res.status(200).json({
        message: 'El estado ha sido actualizado correctamente',
        queryResponse,
      });
    } catch (error) {
      console.error('Error en controlador de Menu de Navegación: ' + error);
      return res.status(500).json({
        message: "Ha occurrido un error al actualizar el estado del menu de navegación",
      });
    }
  }

  async getMenuParentsByIdProfile(req, res) {
    const { profile_fk } = req
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
