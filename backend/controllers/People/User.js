import BaseModel from "../../models/BaseModel.js";
import fs from 'fs';
import { isInputEmpty, isNotDate } from '../../middlewares/Validations.js';

import { comparePwd, encryptPwd } from '../../middlewares/Authorization.js';
class UserController {
    constructor() {
        this.user = new BaseModel('user');
        this.employee = new BaseModel('employee', 'file_employee');
        this.entity = new BaseModel('entity', 'name_entity');
        this.profile = new BaseModel('profile', 'name_profile');
        this.contact = new BaseModel('contact', 'name_contact');
        this.department = new BaseModel('department', 'name_department');
        this.occupation = new BaseModel('occupation', 'name_occupation');
        this.document = new BaseModel('document', 'name_document');


        this.city = new BaseModel('city', 'name_city');
        this.address = new BaseModel('address', 'id_address');


        this.entityContact = new BaseModel('entity_contact', 'id_ec');
        this.entityDepartmentOccupation = new BaseModel('entity_department_occupation', 'id_edc');        
        this.entityDocument = new BaseModel('entity_document', 'id_ed');
    }

    
    async createUser(req, res) {
        console.log(req);
        const avatarUrl = req.file;
        console.log(avatarUrl)
        if (!avatarUrl) {
          return res.status(422).json({
            message: 'El avatar es obligatorio',
            group: 'user',
          });
        }
        const avatarPath = req.filePath;
        console.log(avatarPath);
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
          const checkExistFileEmployee = await this.employee.getOne(file_employee, 'file_employe');
      
          if (checkExistFileEmployee.length > 0) {
            deleteImage();
            return res.status(422).json({ message: 'El numero de legajo ya existe', group: 'employee' });
          }
      
          const checkExistDocument = await this.document.getOne(document_fk, 'name_document')
      
          if (checkExistDocument.length < 1) {
            deleteImage();
            return res.status(422).json({ message: 'El tipo de documento no existe', group: 'entity' });
          }
      
          const checkExistUser = await this.user.getOne(username_user, 'name_username');
      
          if (checkExistUser.length > 0) {
            deleteImage();
            return res.status(422).json({ message: 'Este nombre de usuario ya esta siendo utilizado', group: 'user' });
          }
      
          const checkExistContact = await this.contact.getOne(contact_fk, 'name_contact');
      
          if (checkExistContact.length < 1) {
            deleteImage();
            return res.status(422).json({ message: 'Este tipo de contacto no existe', group: 'entity' });
          }
      
          const checkExistCity = await this.city.getOne(city_fk, 'name_city');
      
          if (checkExistCity.length < 1) {
            deleteImage();
            return res.status(422).json({ message: 'Esta ciudad no existe, ingrese una valida', group: 'address' });
          }
      
          const checkExistDepartment = await this.department.getOne(department_fk, 'name_department');
      
          if (checkExistDepartment.length < 1) {
            deleteImage();
            return res.status(422).json({ message: 'Este departamento no existe, ingrese uno valido', group: 'address' });
          }
      
          const checkExistOccupation = await this.occupation.getOne(occupation_fk, 'name_occupation');
      
          if (checkExistOccupation.length < 1) {
            deleteImage();
            return res.status(422).json({ message: 'El puesto de trabajo no existe, ingrese uno valido', group: 'employee' });
          }
      
          const checkExistProfile = await this.profile.getOne(value_profile, 'name_profile');
      
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
    
    async test(req, res){
        const avatar_url = req.body;
        const test =req.body;
    }
}

export default UserController;
