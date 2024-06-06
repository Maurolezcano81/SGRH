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

import {
  isInputEmpty,
  isInputWithWhiteSpaces,
  isNotNumber,
  isNotAToZ,
  isNotDate,
} from '../../middlewares/Validations.js';

import { encryptPwd } from '../../middlewares/Authorization.js';

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
  try {
    // DESESTRUCTURACIONES

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

    const avatar_url = req.fileUrl;

    // PARSED DATA IN JSON
    const entity_dataInJson = await JSON.parse(entity_data);
    const entity_document_dataInJson = await JSON.parse(entity_document_data);
    const employee_dataInJson = await JSON.parse(employee_data);
    const user_dataInJson = await JSON.parse(user_data);
    const entity_contact_dataInJson = await JSON.parse(entity_contact_data);
    const address_dataInJson = await JSON.parse(address_data);
    const entity_department_occupationInJson = await JSON.parse(entity_department_occupation_data);

    const { name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk } = entity_dataInJson;

    const { document_fk, value_ed } = entity_document_dataInJson;

    const { file_employee, date_entry_employee } = employee_dataInJson;

    const { value_ec, contact_fk } = entity_contact_dataInJson;

    const { description_address, city_fk } = address_dataInJson;

    const { department_fk, occupation_fk } = entity_department_occupationInJson;

    const { username_user, pwd_user } = user_dataInJson;

    const formatDate = (date) => {
      return date.split('-').join('/');
    };

    const date_birth_entity_formatted = formatDate(date_birth_entity);
    const date_entry_employee_formatted = formatDate(date_entry_employee);

    // DESESTRUCTURACIONES

    // VALIDACIONES ENTIDAD

    console.log(entity_dataInJson);
    console.log(entity_document_dataInJson);
    console.log(employee_dataInJson);
    console.log(entity_contact_dataInJson);
    console.log(address_dataInJson);
    console.log(entity_department_occupationInJson);
    console.log(user_dataInJson);
    console.log(avatar_url);
    console.log(value_profile);

    if (
      isInputEmpty(name_entity) ||
      isInputEmpty(lastname_entity) ||
      isInputEmpty(date_birth_entity_formatted) ||
      isInputEmpty(sex_fk) ||
      isInputEmpty(nacionality_fk)
    ) {
      return res.status(422).json({ message: 'Debes completar todos los datos de la persona', group: 'entity' });
    }

    if (isNotDate(date_birth_entity_formatted)) {
      return res.status(422).json({ message: 'La fecha de nacimiento debe ser una fecha valida', group: 'entity' });
    }

    // VALIDACIONES ENTITY DOCUMENT
    if (isInputEmpty(document_fk) || isInputEmpty(value_ed)) {
      return res.status(422).json({ message: 'Debes completar todos los datos de la persona', group: 'entity' });
    }

    // VALIDACIONES EMPLEADO
    if (isInputEmpty(file_employee) || isInputEmpty(date_entry_employee)) {
      return res.status(422).json({ message: 'Debes completar todos los datos del empleado', group: 'employee' });
    }

    if (isNotDate(date_entry_employee_formatted)) {
      return res.status(422).json({ message: 'La fecha de ingreso del empleado debe ser valida', group: 'employee' });
    }

    // VALIDACIONES USUARIO

    if (isInputEmpty(username_user) || isInputEmpty(pwd_user) || !avatar_url) {
      return res.status(422).json({ message: 'Debes completar todos los campos de usuario', group: 'user' });
    }

    // VALIDACIONES CONTACTO
    if (isInputEmpty(value_ec) || isInputEmpty(contact_fk)) {
      return res.status(422).json({ message: 'Debes completar todos los campos de contacto', group: 'entity' });
    }

    // VALIDACIONES DIRECCION
    if (isInputEmpty(description_address) || isInputEmpty(city_fk)) {
      return res.status(422).json({ message: 'Debes completar todos los campos de direccion', group: 'entity' });
    }

    // VALIDACIONES ENTITY_DEPARTMENT_OCCUPATION
    if (isInputEmpty(department_fk) || isInputEmpty(occupation_fk)) {
      return res
        .status(422)
        .json({ message: 'Debes completar todos los campos del puesto de trabajo', group: 'employee' });
    }

    // COMPROBACIONES SI EXISTEN EN BD

    const checkExistFileEmployee = await instanceEmployee.getEmployee(file_employee);

    if (checkExistFileEmployee.length > 0) {
      return res.status(422).json({ message: 'El numero de legajo ya existe', group: 'employee' });
    }

    const checkExistDocument = await instanceDocument.getDocument(document_fk);

    if (checkExistDocument.length < 1) {
      return res.status(422).json({ message: 'El tipo de documento no existe', group: 'entity' });
    }

    const checkExistUser = await instanceUser.getUserByUsername(username_user);

    if (checkExistUser.length > 0) {
      return res.status(422).json({ message: 'Este nombre de usuario ya esta siendo utilizado', group: 'user' });
    }

    const checkExistContact = await instanceContact.getContact(contact_fk);

    if (checkExistContact.length < 1) {
      return res.status(422).json({ message: 'Este tipo de contacto no existe', group: 'entity' });
    }

    const checkExistCity = await instanceCity.getCityById(city_fk);

    if (checkExistCity.length < 1) {
      return res.status(422).json({ message: 'Esta ciudad no existe, ingrese una valida', group: 'address' });
    }

    const checkExistDepartment = await instanceDepartment.getDepartment(department_fk);

    if (checkExistDepartment.length < 1) {
      return res.status(422).json({ message: 'Este departamento no existe, ingrese uno valido', group: 'address' });
    }

    const checkExistOccupation = await instanceOccupation.getOccupation(occupation_fk);

    if (checkExistOccupation.length < 1) {
      return res.status(422).json({ message: 'El puesto de trabajo no existe, ingrese uno valido', group: 'employee' });
    }

    const checkExistProfile = await instanceProfile.getProfile(value_profile);

    if (checkExistProfile.length < 1) {
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
      return res
        .status(422)
        .json({ message: 'Error al crear usuario, comprueba los datos de la persona', group: 'alert' });
    }

    // EMPLEADO
    const employee_data_completed = {
      file_employee: file_employee,
      date_entry_employee: date_entry_employee_formatted,
      entity_fk: idEntity,
    };

    const insertEmployee = await instanceEmployee.createEmployee(employee_data_completed);

    if (!insertEmployee) {
      return res
        .status(422)
        .json({ message: 'Error al crear usuario, comprueba los datos de empleado', group: 'alert' });
    }

    // CONTACTO

    const entity_contact_data_completed = {
      value_ec: value_ec,
      entity_fk: idEntity,
      contact_fk: contact_fk,
    };

    console.log(entity_contact_data_completed);

    const insertEntityContact = await instanceEntityContact.createEntityContact(entity_contact_data_completed);

    if (!insertEntityContact) {
      return res
        .status(422)
        .json({ message: 'Error al crear el usuario, comprueba los datos de contacto', group: 'alert' });
    }

    // ADDRESS

    const address_data_completed = {
      description_address: description_address,
      city_fk: city_fk,
      entity_fk: idEntity,
    };

    const insertAddress = await instanceAddress.createAddress(address_data_completed);

    if (!insertAddress) {
      return res
        .status(422)
        .json({ message: 'Error al crear el usuario, comprueba los datos del domicilio', group: 'alert' });
    }

    // ENTITY DEPARTMENT OCCUPATION

    const entityDepartmentOccupation_data_completed = {
      entity_fk: idEntity,
      department_fk: department_fk,
      occupation_fk: occupation_fk,
    };

    const insertEntityDepartmentOccupation = await instanceEntityDepartmentOccupation.createEntityDepartmentOccupation(
      entityDepartmentOccupation_data_completed
    );

    if (!insertEntityDepartmentOccupation) {
      return res.status(422).json({
        message: 'Error al crear el usuario, comprueba los datos del departamento, y el puesto de trabajo',
        group: 'alert',
      });
    }

    // USUARIO
    const pwdHashed = await encryptPwd(pwd_user);

    const user_data_completed = {
      username_user: username_user,
      pwd_user: pwdHashed,
      avatar_user: avatar_url,
      entity_fk: idEntity,
      profile_fk: value_profile,
    };

    const insertUser = await instanceUser.createUser(user_data_completed);

    if (!insertUser) {
      return res
        .status(422)
        .json({ message: 'Error al crear usuario, comprueba los datos de usuario', group: 'alert' });
    }

    res.status(200).json({
      message: 'La cuenta del personal ha sido dada de alta satisfactoriamente',
      userId: insertUser.insertId,
    });
  } catch (error) {
    console.error('Error en UserController :' + error);
    res.status(500).json({
      message: error.message,
      group: 'alert',
    });
  }
};
