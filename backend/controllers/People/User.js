import BaseModel from "../../models/BaseModel.js";
import fs from 'fs';
import { formatDateYear, isInputEmpty, isNotAToZ, isNotDate, isNotNumber } from '../../middlewares/Validations.js';

import { comparePwd, encryptPwd, createToken } from '../../middlewares/Authorization.js';
import UserModel from "../../models/People/User.js";
import EntityModel from "../../models/People/People/Entity.js";
import TerminationModel from "../../models/Termination/TerminationModel.js";

class UserController {
  constructor() {
    this.user = new UserModel();
    this.employee = new BaseModel('employee', 'file_employee');
    this.entity = new EntityModel();
    this.profile = new BaseModel('profile', 'name_profile');
    this.contact = new BaseModel('contact', 'name_contact');
    this.department = new BaseModel('department', 'name_entity');
    this.occupation = new BaseModel('occupation', 'name_occupation');
    this.document = new BaseModel('document', 'name_document');

    this.city = new BaseModel('city', 'name_city');
    this.address = new BaseModel('address', 'id_address');

    this.status_employee = new BaseModel('type_status_employee', 'name_tse');

    this.entityContact = new BaseModel('entity_contact', 'id_ec');
    this.entityDepartmentOccupation = new BaseModel('entity_department_occupation', 'id_edc');
    this.entityDocument = new BaseModel('entity_document', 'id_ed');

    this.terminationEmployee = new TerminationModel();

    this.nameFieldId = 'id_user';
    this.nameFieldToSearch = 'username_user';

  }


  async toggleStatusUser(req, res) {
    const { id_user, status } = req.body;
    try {

      const checkUser = await this.user.getOne(id_user, this.nameFieldId);

      if (checkUser.length < 1) {
        return res.status(403).json({
          message: "Este usuario no existe"
        })
      }

      if (status != 1 && status != 0) {
        return res.status(403).json({
          message: "Error al actualizar el estado del usuario, intente reiniciando el sitio"
        })
      }


      const update = await this.user.updateOne({ status_user: status }, ['id_user', id_user])

      if (update.affectedRows < 1) {
        return res.status(403).json({
          message: "Error al actualizar el estado del usuario, intente reiniciando el sitio"
        })
      }

      return res.status(200).json({
        message: "Estado actualizado correctamente"
      })

    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(req, res) {
    const { limit, offset, order, orderBy, filters } = req.body;

    try {

      const getTotalResults = await this.user.getTotalUsersInformation(limit, offset, orderBy, order, filters);

      const list = await this.user.getUsersInformation(limit, offset, orderBy, order, filters);

      if (!list) {
        return res.status(403).json({
          message: "Ha ocurrido un error al obtener los usuarios, intentalo de nuevo"
        })
      }

      return res.status(200).json({
        message: "Lista de usuarios obtenida con exito",
        list: list,
        total: getTotalResults[0].total
      })

    } catch (error) {
      console.log(error);
    }


  }

  async checkToken(req, res) {
    const { id_user } = req;

    try {
      const userDataLogin = await this.user.getUserDataLogin(id_user);

      const dataToToken = {
        userId: userDataLogin.id_user,
        profile_fk: userDataLogin.profile_fk,
      };

      const queryResponse = {
        ...userDataLogin,
        token: createToken(dataToToken),
      };

      return res.status(200).json({
        message: "Sesion verificada",
        queryResponse
      })
    } catch (error) {
      console.log(error);
    }

  }

  async updateProfile(req, res) {
    const { id_user, profile_fk } = req.body;

    try {
      if (isNotNumber(profile_fk)) {
        return res.status(403).json({
          message: "Los datos del tipo de permiso son incorrectos, intente nuevamente actualizando la pagina"
        })
      }

      if (isNotNumber(id_user)) {
        return res.status(403).json({
          message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
        })
      }

      const update = await this.user.updateOne({ id_user: id_user, profile_fk: profile_fk }, [this.nameFieldId, id_user]);

      if (update.affectedRows < 1) {
        return res.status(403).json({
          message: "No se ha podido actualizar"
        })
      }

      return res.status(200).json({
        message: "Nombre actualizado correctamente"
      })
    } catch (error) {
      console.log(error);
    }


  }

  async updateUsername(req, res) {
    const { id_user, username_user } = req.body;

    try {
      if (isNotNumber(id_user)) {
        return res.status(403).json({
          message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
        })
      }

      if (isInputEmpty(username_user)) {
        return res.status(403).json({
          message: "Debe completar todos los campos"
        })
      }

      const checkExistsUsername = await this.user.getOne(username_user, this.nameFieldToSearch);

      if (checkExistsUsername.length >= 1) {
        return res.status(403).json({
          message: "Este nombre de usuario ya existe"
        })
      }

      const update = await this.user.updateOne({ username_user: username_user }, [this.nameFieldId, id_user]);

      if (update.affectedRows < 1) {
        return res.status(403).json({
          message: "No se ha podido actualizar"
        })
      }

      return res.status(200).json({
        message: "Nombre actualizado correctamente"
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getProfileUserData(req, res) {
    const { value_user } = req.body;
    const { id_user, profile_fk } = req;

    try {
      if (isInputEmpty(value_user)) {
        res.status(403).json({
          message: 'No tiene permisos',
        });
      }

      const getUser = await this.user.getOne(value_user, 'id_user');

      if (getUser.length < 1) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const { username_user, avatar_user, status_user, haspwdchanged_user, created_at, entity_fk } = getUser[0];

      const getEntity = await this.entity.getDataPersonal(entity_fk, 'id_entity');

      if (getEntity.length < 1) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const getDocuments = await this.entity.getEntityDocuments(entity_fk);

      const getContacts = await this.entity.getEntityContacts(entity_fk);
      const personalData = {
        entity: {
          ...getEntity
        },
        documents: {
          ...getDocuments
        },
        contact: {
          ...getContacts
        },
      }


      const getProfile = await this.user.getUserProfile(id_user);


      const userData = {
        user: {
          ...getUser,
        },
        profile: {
          ...getProfile
        }
      }

      const getAddress = await this.entity.getEntityAddress(entity_fk);

      const addressData = {
        ...getAddress
      };

      const getDepartment = await this.entity.getEntityDepartment(entity_fk);

      const getOccupation = await this.entity.getEntityOccupation(entity_fk);

      const getEmployee = await this.entity.getEntityEmployee(entity_fk);

      const getLastTermination = await this.terminationEmployee.getLastTerminationsByEmployee(getEmployee[0]?.id_employee)

      let employeeData = {
        occupation: {
          ...getOccupation
        },
        department: {
          ...getDepartment
        },
        employee: {
          ...getEmployee,
        }
      }

      if (getLastTermination.length > 0 && getEmployee[0].status_employee === 0) {
        employeeData = {
          occupation: {
            ...getOccupation
          },
          department: {
            ...getDepartment
          },
          employee: {
            ...getEmployee,
          },
          termination: {
            ...getLastTermination[0]
          }
        };
      }

      const isTheSameUser = id_user === getUser[0].id_user ? true : false;

      const canChangePwdRrhh = await this.user.canViewModule(id_user, '/rrhh/contraseña/cambiar');

      const canChangePwdEmployee = await this.user.canViewModule(id_user, '/personal/contraseña/cambiar');

      const isAdminView = await this.user.canViewModule(id_user, '/admin/perfiles');

      let isRrhh = canChangePwdRrhh.length > 0 ? 1 : 0;

      let isEmployee = canChangePwdEmployee.length > 0 ? 1 : 0;

      let isAdmin = isAdminView.length > 0 ? 1 : 0;

      const canEdit = isRrhh === 1 || isEmployee === 1 || isAdmin === 1 ? true : false;

      const permissions__data = {
        isAdmin: isAdmin,
        isRrhh: isRrhh,
        isEmployee: isEmployee,
        isTheSameUser: isTheSameUser,
        canEdit: canEdit,
      };

      res.status(200).json({
        message: 'Perfil obtenido con exito',
        userData,
        personalData,
        addressData,
        employeeData,
        permissions__data: permissions__data,
      });


    } catch (error) {
      console.log(error);
    }
  }

  async createUser(req, res) {
    const avatarUrl = req.file;
    if (!avatarUrl) {
      return res.status(422).json({
        message: 'El avatar es obligatorio',
        group: 'user',
      });
    }
    const avatarPath = avatarUrl.path;
    console.log(avatarPath)
    const deleteImage = () => {
      if (avatarPath) {
        fs.unlink(avatarPath, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          } else {
            console.log('Imagen eliminada correctamente');
          }
        });
      }
    };

    const formatDateYear = (dateString) => {
      const date = new Date(dateString);
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${year}-${month}-${day}`;
    };

    try {
      const {
        entity_data,
        entity_document_data,
        employee_data,
        user_data,
        entity_contact_data,
        address_data,
        entity_department_occupation_data,
        value_profile,
      } = req.body;

      // PARSED DATA IN JSON
      const entity_dataInJson = JSON.parse(entity_data);
      const entity_document_dataInJson = JSON.parse(entity_document_data);
      const employee_dataInJson = JSON.parse(employee_data);
      const user_dataInJson = JSON.parse(user_data);
      const entity_contact_dataInJson = JSON.parse(entity_contact_data);
      const address_dataInJson = JSON.parse(address_data);
      const entity_department_occupationInJson = JSON.parse(entity_department_occupation_data);

      const { name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk } = entity_dataInJson;
      const { document_fk, value_ed } = entity_document_dataInJson;
      const { file_employee, date_entry_employee } = employee_dataInJson;
      const { value_ec, contact_fk } = entity_contact_dataInJson;
      const { description_address, city_fk } = address_dataInJson;
      const { department_fk, occupation_fk } = entity_department_occupationInJson;
      const { username_user, pwd_user } = user_dataInJson;


      const date_birth_entity_formatted = formatDateYear(date_birth_entity);
      const date_entry_employee_formatted = formatDateYear(date_entry_employee);

      // VALIDACIONES ENTIDAD
      if (
        isInputEmpty(name_entity) ||
        isInputEmpty(lastname_entity) ||
        isInputEmpty(date_birth_entity_formatted) ||
        isInputEmpty(sex_fk) ||
        isInputEmpty(nacionality_fk)
      ) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los datos de la persona', group: 'entity' });
      }

      if (isNotDate(date_birth_entity_formatted)) {
        deleteImage();
        return res.status(422).json({ message: 'La fecha de nacimiento debe ser una fecha valida', group: 'entity' });
      }

      // Calcular la edad
      const birthDate = new Date(date_birth_entity_formatted);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18 || age > 100) {
        deleteImage();
        return res.status(403).json({ message: 'La edad debe estar entre 18 y 100 años.', group: 'entity' });
      }

      // VALIDACIONES ENTITY DOCUMENT
      if (isInputEmpty(document_fk) || isInputEmpty(value_ed)) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los datos de la persona', group: 'entity' });
      }

      // VALIDACIONES EMPLEADO
      if (isInputEmpty(file_employee) || isInputEmpty(date_entry_employee)) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los datos del empleado', group: 'employee' });
      }

      if (isNotDate(date_entry_employee_formatted)) {
        deleteImage();
        return res.status(422).json({ message: 'La fecha de ingreso del empleado debe ser valida', group: 'employee' });
      }

      // Calcular la edad
      const entryDate = new Date(date_entry_employee_formatted);
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < entryDate.getDate())) {
        age--;
      }

      if (age > 80) {
        return res.status(403).json({ message: 'La fecha de ingreso no puede ser mayor a 80 años.', group: 'employee' });
      }

      // VALIDACIONES USUARIO
      if (isInputEmpty(username_user) || isInputEmpty(pwd_user) || !avatarPath) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los campos de usuario', group: 'user' });
      }

      // VALIDACIONES CONTACTO
      if (isInputEmpty(value_ec) || isInputEmpty(contact_fk)) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los campos de contacto', group: 'entity' });
      }

      // VALIDACIONES DIRECCION
      if (isInputEmpty(description_address) || isInputEmpty(city_fk)) {
        deleteImage();
        return res.status(422).json({ message: 'Debes completar todos los campos de direccion', group: 'address' });
      }

      // VALIDACIONES ENTITY_DEPARTMENT_OCCUPATION
      if (isInputEmpty(department_fk) || isInputEmpty(occupation_fk)) {
        deleteImage();
        return res
          .status(422)
          .json({ message: 'Debes completar todos los campos del puesto de trabajo', group: 'employee' });
      }

      // COMPROBACIONES SI EXISTEN EN BD
      const checkExistFileEmployee = await this.employee.getOne(file_employee, 'file_employee');

      if (checkExistFileEmployee.length > 0) {
        deleteImage();
        return res.status(422).json({ message: 'El numero de legajo ya existe', group: 'employee' });
      }

      const checkExistDocument = await this.document.getOne(document_fk, 'id_document')

      if (checkExistDocument.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'El tipo de documento no existe', group: 'entity' });
      }

      const checkExistUser = await this.user.getOne(username_user, 'username_user');

      if (checkExistUser.length > 0) {
        deleteImage();
        return res.status(422).json({ message: 'Este nombre de usuario ya esta siendo utilizado', group: 'user' });
      }

      const checkExistContact = await this.contact.getOne(contact_fk, 'id_contact');

      if (checkExistContact.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'Este tipo de contacto no existe', group: 'entity' });
      }

      const checkExistCity = await this.city.getOne(city_fk, 'id_city');

      if (checkExistCity.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'Esta ciudad no existe, ingrese una valida', group: 'address' });
      }

      const checkExistDepartment = await this.department.getOne(department_fk, 'id_department');

      if (checkExistDepartment.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'Este departamento no existe, ingrese uno valido', group: 'address' });
      }

      const checkExistOccupation = await this.occupation.getOne(occupation_fk, 'id_occupation');

      if (checkExistOccupation.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'El puesto de trabajo no existe, ingrese uno valido', group: 'employee' });
      }

      const checkExistProfile = await this.profile.getOne(value_profile, 'id_profile');

      if (checkExistProfile.length < 1) {
        deleteImage();
        return res.status(422).json({ message: 'El tipo de permiso no existe, ingrese uno valido', group: 'permission' });
      }



      const checkExistTypeStatusEmployee = await this.status_employee.getOne('Activo', 'name_tse');

      if (checkExistTypeStatusEmployee.length < 1) {
        deleteImage();
        return res.status(500).json({ message: 'No se ha podido realizar el registro del empleado, intente reiniciando el sitio', group: 'alert' });
      }



      // INSERTS EN LA BD

      // PERSONA
      const entity_data_completed = {
        name_entity: name_entity,
        lastname_entity: lastname_entity,
        date_birth_entity: date_birth_entity_formatted,
        sex_fk: sex_fk,
        nacionality_fk: nacionality_fk,
      };

      const insertEntity = await this.entity.createOne(entity_data_completed);

      if (!insertEntity) {
        deleteImage();
        return res
          .status(422)
          .json({ message: 'Error al crear usuario, comprueba los datos de la persona', group: 'alert' });
      }

      const idEntity = insertEntity.lastId;

      // PERSONA DOCUMENTO
      const entity_document_data_completed = {
        entity_fk: idEntity,
        document_fk: document_fk,
        value_ed: value_ed,
      };

      const insertDocumentEntity = await this.entityDocument.createOne(entity_document_data_completed);

      if (!insertDocumentEntity) {
        deleteImage();
        return res.status(422).json({ message: 'Error al asignar documento a la persona', group: 'alert' });
      }

      // EMPLEADO
      const employee_data_completed = {
        entity_fk: idEntity,
        file_employee: file_employee,
        date_entry_employee: date_entry_employee_formatted,
        tse_fk: 1
      };

      const insertEmployee = await this.employee.createOne(employee_data_completed);

      if (!insertEmployee) {
        deleteImage();
        return res.status(422).json({ message: 'Error al crear empleado', group: 'alert' });
      }

      // USUARIO
      const hashedPwd = await encryptPwd(pwd_user);
      const user_data_completed = {
        entity_fk: idEntity,
        username_user: username_user,
        pwd_user: hashedPwd,
        avatar_user: avatarPath,
        profile_fk: value_profile,
      };

      const insertUser = await this.user.createOne(user_data_completed);

      if (!insertUser) {
        deleteImage();
        return res.status(422).json({ message: 'Error al crear usuario', group: 'alert' });
      }

      // CONTACTO DE LA PERSONA
      const entity_contact_data_completed = {
        entity_fk: idEntity,
        value_ec: value_ec,
        contact_fk: contact_fk,
      };

      const insertEntityContact = await this.entityContact.createOne(entity_contact_data_completed);

      if (!insertEntityContact) {
        deleteImage();
        return res.status(422).json({ message: 'Error al asignar contacto a la persona', group: 'alert' });
      }

      // DIRECCION DE LA PERSONA
      const address_data_completed = {
        description_address: description_address,
        entity_fk: idEntity,
        city_fk: city_fk,
      };

      const insertAddress = await this.address.createOne(address_data_completed);

      if (!insertAddress) {
        deleteImage();
        return res.status(422).json({ message: 'Error al crear direccion', group: 'alert' });
      }

      // DEPARTAMENTO Y PUESTO DE TRABAJO DE LA PERSONA
      const entity_department_occupation_data_completed = {
        entity_fk: idEntity,
        department_fk: department_fk,
        occupation_fk: occupation_fk,
      };

      const insertEntityDepartmentOccupation = await this.entityDepartmentOccupation.createOne(
        entity_department_occupation_data_completed
      );

      if (!insertEntityDepartmentOccupation) {
        deleteImage();
        return res.status(422).json({ message: 'Error al asignar puesto de trabajo', group: 'alert' });
      }

      res.status(200).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      deleteImage();
      res.status(500).json({ message: 'Error al crear usuario', group: 'alert' });
    }
  }

  async changePwdEmployee(req, res) {
    const { id_user, pwd_new, pwd_actual } = req.body;

    console.log(req.body);
    try {
      if (isInputEmpty(id_user) || isInputEmpty(pwd_new) || isInputEmpty(pwd_actual)) {
        throw new Error('Debes completar todos los campos');
      }

      // Verificar si el usuario existe en la base de datos
      const checkPwdInDb = await this.user.getOne(id_user, "id_user");

      if (!checkPwdInDb || checkPwdInDb.length < 1) {
        throw new Error('Los datos para cambiar la contraseña son erróneos, intente reiniciando el sitio o más tarde');
      }

      // Comparar la contraseña actual con la que está en la base de datos
      const isPwdCorrect = await comparePwd(pwd_actual, checkPwdInDb[0].pwd_user);

      // Si la contraseña actual es incorrecta, devolver un error
      if (!isPwdCorrect) {
        return res.status(401).json({
          message: 'La contraseña actual es incorrecta',
        });
      }

      // Encriptar la nueva contraseña
      const hashPwd = await encryptPwd(pwd_new);

      // Actualizar la contraseña en la base de datos
      const changePwdEmployee = await this.user.changePwdEmployee(id_user, hashPwd);

      // Respuesta de éxito
      return res.status(200).json({
        message: 'Cambio de contraseña finalizado de manera exitosa',
        changePwdEmployee,
      });

    } catch (error) {
      console.error('Ha ocurrido un error en el controlador: ' + error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
  }


  async changePwdAdmin(req, res) {
    const { id_user, pwd_user } = req.body;
    console.log(req.body);

    try {

      if (isInputEmpty(id_user) || isInputEmpty(pwd_user)) {
        throw new Error('Debes completar todos los campos');
      }

      const hashPwd = await encryptPwd(pwd_user);

      const changePwdAdmin = await this.user.changePwdAdmin(id_user, pwd_user);

      return res.status(200).json({
        message: 'Cambio de contraseña finalizado de manera exitosa',
        changePwdAdmin,
      });
    } catch (error) {
      console.error('Ha ocurrido un error en controlador de ' + error);
      res.status(401).json({
        message: error.message,
      });
    }

  }

  async hasToChangePwd(req, res) {
    try {
      const { id_user } = req;

      const results = await this.user.getOne(id_user, 'id_user');

      if (results.length < 1) {
        return res.status(422).json({
          message: 'Ha ocurrido un error',
        });
      }

      if (results[0].haspwdchanged_user === 0) {
        return res.status(200).json({
          haspwdchanged: false,
        });
      }

      return res.status(200).json({
        haspwdchanged: true,
      });
    } catch (error) {
      console.error('Error al comprobar el cambio de contraseña del usuario:', error);
      res.status(500).json({ message: 'Error al comprobar el cambio de contraseña del usuario', group: 'alert' });
    }
  }

  async canViewModule(req, res) {
    const { id_user } = req;
    const { urlToCheck } = req.body;

    try {
      const results = await this.user.canViewModule(id_user, urlToCheck);
      if (results.length > 0) {
        res.status(200).json({ message: 'El usuario tiene permisos para ver este módulo' });
      } else {
        res.status(403).json({ message: 'El usuario no tiene permisos para ver este módulo' });
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      res.status(500).json({ message: 'Error al verificar permisos del usuario' });
    }
  }

  async changePwdEmployee(req, res) {
    const { id_user, pwd_new, pwd_actual } = req.body;
    try {
      if (isInputEmpty(id_user) || isInputEmpty(pwd_new) || isInputEmpty(pwd_actual)) {
        throw new Error('Debes completar todos los campos');
      }

      const checkPwdInDb = await this.user.getOne(id_user, 'id_user');

      if (checkPwdInDb.length < 1) {
        throw new Error('Los datos para cambiar la contraseña son errones, intente reiniciando el sitio o mas tarde');
      }

      const isPwdCorrect = await comparePwd(pwd_actual, checkPwdInDb[0].pwd_user);
      const hashPwd = await encryptPwd(pwd_new);

      if (!isPwdCorrect) {
        if (id_user === checkPwdInDb[0].id_user && pwd_actual === checkPwdInDb[0].pwd_user) {
          const changePwdEmployee = await this.user.changePwdEmployee(id_user, hashPwd);

          return res.status(200).json({
            message: 'Cambio de contraseña finalizado de manera exitosa',
            changePwdEmployee,
          });
        } else {
          return res.status(401).json({
            message: 'La contraseña actual es incorrecta',
          });
        }
      }

      const changePwdEmployee = await this.user.changePwdEmployee(id_user, hashPwd);

      return res.status(200).json({
        message: 'Cambio de contraseña finalizado de manera exitosa',
        changePwdEmployee,
      });
    } catch (error) {
      console.error('Ha ocurrido un error en controlador de ' + error);
      res.status(401).json({
        message: error.message,
      });
    }
  };

  async changePwdAdmin(req, res) {
    const { id_user, pwd_user } = req.body;
    try {

      if (isInputEmpty(id_user) || isInputEmpty(pwd_user)) {
        throw new Error('Debes completar todos los campos');
      }

      const checkPwdInDb = await this.user.getOne(id_user, 'id_user');

      if (checkPwdInDb.length < 1) {
        throw new Error('Los datos para cambiar la contraseña son errones, intente reiniciando el sitio o mas tarde');
      }

      const hashPwd = await encryptPwd(pwd_user);

      const changePwdAdmin = await this.changePwdAdmin(id_user, hashPwd);

      return res.status(200).json({
        message: 'Cambio de contraseña finalizado de manera exitosa',
        changePwdAdmin,
      });
    } catch (error) {
      console.error('Ha ocurrido un error en controlador de ' + error);
      res.status(401).json({
        message: error.message,
      });
    }
  };

}


export default UserController;
