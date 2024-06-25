import fs from 'fs';
import Employee from '../../models/People/Employee.js';
import Entity from '../../models/People/Entity.js';
import User from '../../models/People/User.js';
import Profile from '../../models/Auth/Profile.js';
import Contact from '../../models/System/Contact.js';
import EntityContact from '../../models/Address/EntityContact.js';
import City from '../../models/Address/City.js';
import Address from '../../models/Address/Address.js';
import Document from '../../models/System/Document.js';
import Department from '../../models/Department/Department.js';
import Occupation from '../../models/Department/Occupation.js';
import EntityDepartmentOccupation from '../../models/Department/EntityDepartmentOccupattion.js';
import EntityDocument from '../../models/People/EntityDocument.js';

import { isInputEmpty, isNotDate } from '../../middlewares/Validations.js';

import { comparePwd, encryptPwd } from '../../middlewares/Authorization.js';
import UserCredentials from '../../models/Auth/UserCredentials.js';

const instanceEmployee = new Employee();
const instanceEntity = new Entity();
const instanceUser = new User();
const instanceProfile = new Profile();
const instanceContact = new Contact();
const instanceEntityContact = new EntityContact();
const instanceCity = new City();
const instanceDepartment = new Department();
const instanceOccupation = new Occupation();
const instanceEntityDepartmentOccupation = new EntityDepartmentOccupation();
const instanceAddress = new Address();
const instanceDocument = new Document();
const instanceEntityDocument = new EntityDocument();

export const createUser = async (req, res) => {
  const avatarUrl = req.fileUrl;

  if (!avatarUrl) {
    return res.status(422).json({
      message: 'El avatar es obligatorio',
      group: 'user',
    });
  }
  const avatarPath = req.filePath;
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

    const formatDate = (date) => date.split('-').join('/');

    const date_birth_entity_formatted = formatDate(date_birth_entity);
    const date_entry_employee_formatted = formatDate(date_entry_employee);

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
    const checkExistFileEmployee = await instanceEmployee.getEmployee(file_employee);

    if (checkExistFileEmployee.length > 0) {
      deleteImage();
      return res.status(422).json({ message: 'El numero de legajo ya existe', group: 'employee' });
    }

    const checkExistDocument = await instanceDocument.getDocument(document_fk);

    if (checkExistDocument.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'El tipo de documento no existe', group: 'entity' });
    }

    const checkExistUser = await instanceUser.getUserByUsername(username_user);

    if (checkExistUser.length > 0) {
      deleteImage();
      return res.status(422).json({ message: 'Este nombre de usuario ya esta siendo utilizado', group: 'user' });
    }

    const checkExistContact = await instanceContact.getContact(contact_fk);

    if (checkExistContact.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'Este tipo de contacto no existe', group: 'entity' });
    }

    const checkExistCity = await instanceCity.getCityById(city_fk);

    if (checkExistCity.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'Esta ciudad no existe, ingrese una valida', group: 'address' });
    }

    const checkExistDepartment = await instanceDepartment.getDepartment(department_fk);

    if (checkExistDepartment.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'Este departamento no existe, ingrese uno valido', group: 'address' });
    }

    const checkExistOccupation = await instanceOccupation.getOccupation(occupation_fk);

    if (checkExistOccupation.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'El puesto de trabajo no existe, ingrese uno valido', group: 'employee' });
    }

    const checkExistProfile = await instanceProfile.getProfile(value_profile);

    if (checkExistProfile.length < 1) {
      deleteImage();
      return res.status(422).json({ message: 'El tipo de permiso no existe, ingrese uno valido', group: 'permission' });
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

    const insertEntity = await instanceEntity.createEntity(entity_data_completed);

    if (!insertEntity) {
      deleteImage();
      return res
        .status(422)
        .json({ message: 'Error al crear usuario, comprueba los datos de la persona', group: 'alert' });
    }

    const idEntity = insertEntity.insertId;

    // PERSONA DOCUMENTO
    const entity_document_data_completed = {
      entity_fk: idEntity,
      document_fk: document_fk,
      value_ed: value_ed,
    };

    const insertDocumentEntity = await instanceEntityDocument.assignDocumentToEntity(entity_document_data_completed);

    if (!insertDocumentEntity) {
      deleteImage();
      return res.status(422).json({ message: 'Error al asignar documento a la persona', group: 'alert' });
    }

    // EMPLEADO
    const employee_data_completed = {
      entity_fk: idEntity,
      file_employee: file_employee,
      date_entry_employee: date_entry_employee_formatted,
    };

    const insertEmployee = await instanceEmployee.createEmployee(employee_data_completed);

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
      avatar_user: req.fileUrl,
      profile_fk: value_profile,
    };

    const insertUser = await instanceUser.createUser(user_data_completed);

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

    const insertEntityContact = await instanceEntityContact.createEntityContact(entity_contact_data_completed);

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

    const insertAddress = await instanceAddress.createAddress(address_data_completed);

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

    const insertEntityDepartmentOccupation = await instanceEntityDepartmentOccupation.createEntityDepartmentOccupation(
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
};

export const hasToChangePwd = async (req, res) => {
  try {
    const { id_user } = req;

    const results = await instanceUser.hasToChangePwd(id_user);

    if (results.length < 1) {
      return res.status(422).json({
        message: 'Ha ocurrido un error',
      });
    }

    console.log(results[0]);

    if (results[0].haspwdchanged_user != 0) {
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
};

export const changePwdEmployee = async (req, res) => {
  const { id_user, pwd_new, pwd_actual } = req.body;
  try {
    if (isInputEmpty(id_user) || isInputEmpty(pwd_new) || isInputEmpty(pwd_actual)) {
      throw new Error('Debes completar todos los campos');
    }

    const checkPwdInDb = await instanceUser.getUserByUsername(id_user);

    if (checkPwdInDb.length < 1) {
      throw new Error('Los datos para cambiar la contraseña son errones, intente reiniciando el sitio o mas tarde');
    }

    const isPwdCorrect = await comparePwd(pwd_actual, checkPwdInDb[0].pwd_user);
    const hashPwd = await encryptPwd(pwd_new);

    if (!isPwdCorrect) {
      if (id_user === checkPwdInDb[0].id_user && pwd_actual === checkPwdInDb[0].pwd_user) {
        const changePwdEmployee = await instanceUser.changePwdEmployee(id_user, hashPwd);

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

    const changePwdEmployee = await instanceUser.changePwdEmployee(id_user, hashPwd);

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

export const changePwdAdmin = async (req, res) => {
  const { id_user, pwd_user} = req.body;
  try {

    if (isInputEmpty(id_user) || isInputEmpty(pwd_user)) {
      throw new Error('Debes completar todos los campos');
    }

    const checkPwdInDb = await instanceUser.getUserByUsername(id_user);

    if (checkPwdInDb.length < 1) {
      throw new Error('Los datos para cambiar la contraseña son errones, intente reiniciando el sitio o mas tarde');
    }

    const hashPwd = await encryptPwd(pwd_user);

    const changePwdAdmin = await instanceUser.changePwdAdmin(id_user, hashPwd);

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

export const getDataUserForProfile = async (req, res) => {
  const { value_user } = req.body;
  const { id_user, profile_fk } = req;
  try {
    if (isInputEmpty(value_user)) {
      res.status(403).json({
        message: 'No tiene permisos',
      });
    }

    const getUser = await instanceUser.getUserByUsername(value_user);

    if (getUser.length < 1) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const { username_user, avatar_user, status_user, haspwdchanged_user, created_at, entity_fk } = getUser[0];

    const getEntity = await instanceEntity.getEntityById(entity_fk);

    if (getEntity.length < 1) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const getDepartment = await instanceEntity.getEntityDepartment(entity_fk);

    const getOccupation = await instanceEntity.getEntityOccupation(entity_fk);

    const department__data = {
      ...getDepartment,
    };

    const occupation__data = {
      ...getOccupation,
    };

    const user__data = {
      ...getUser,
    };

    const entity__data = {
      ...getEntity,
    };

    const isTheSameUser = id_user === getUser[0].id_user ? true : false;

    const canEdit = profile_fk === 1 || profile_fk === 2 ? true : false;

    const permissions__data = {
      isTheSameUser: isTheSameUser,
      canEdit: canEdit,
    };
    res.status(200).json({
      message: 'Perfil obtenido con exito',
      department__data,
      occupation__data,
      user__data,
      entity__data,
      permissions__data: permissions__data,
    });
  } catch (error) {
    console.log(error);
  }
};
