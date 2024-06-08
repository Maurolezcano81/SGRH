import {
  createSex,
  getSex,
  getSexs,
  updateSex,
  toggleStatusSex,
  deleteSex,
} from '../../controllers/System/SexControllers.js';
import {
  createNacionality,
  getNacionality,
  getNacionalities,
  updateNacionality,
  toggleStatusNacionality,
  deleteNacionality,
} from '../../controllers/System/NacionalityControllers.js';
import {
  createCountry,
  getCountry,
  getCountries,
  updateCountry,
  toggleStatusCountry,
  deleteCountry,
} from '../../controllers/System/CountryControllers.js';
import {
  createStatusRequest,
  getStatusRequest,
  getStatusesRequest,
  updateStatusRequest,
  toggleStatusRequest,
  deleteStatusRequest,
} from '../../controllers/System/StatusRequestControllers.js';

import {
  createContact,
  getContact,
  getContacts,
  updateContact,
  toggleStatusContact,
  deleteContact,
} from '../../controllers/System/ContactControllers.js';

import {
  createOccupation,
  getOccupation,
  getOccupations,
  updateOccupation,
  toggleStatusOccupation,
  deleteOccupation,
} from '../../controllers/System/OccupationController.js';

import {
  createTot,
  getTot,
  getTots,
  updateTot,
  toggleStatusTot,
  deleteTot,
} from '../../controllers/System/Type_of_terminationControllers.js';

import {
  createModule,
  getModule,
  getModules,
  getModulesByProfile,
  updateModule,
  toggleStatusModule,
  deleteModule,
  bindModuleToProfile,
  unBindModuleToProfile,
} from '../../controllers/System/ModuleControllers.js';

import {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  toggleStatusDocument,
  deleteDocument,
} from '../../controllers/System/DocumentControllers.js';

import {
  createProfile,
  getProfile,
  getProfiles,
  updateProfile,
  toggleStatusProfile,
  deleteProfile,
} from '../../controllers/System/Profile.js';

import {
  createDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
  toggleStatusDepartment,
  deleteDepartment,
} from '../../controllers/System/Department.js';

import {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  toggleStatusSubject,
  deleteSubject,
} from '../../controllers/System/SubjectTypeControllers.js';

import {
  createAttachment,
  getAttachment,
  getAttachments,
  updatedAttachment,
  toggleStatusAttachment,
  deleteAttachment,
} from '../../controllers/System/AttachmentType.js';

import {
  createNavigationMenu,
  getNavigationMenu,
  getNavigationMenus,
  updatedNavigationMenu,
  toggleStatusNavigationMenu,
  deleteNavigationMenu,
} from '../../controllers/System/NavigationMenuControllers.js';


import express from 'express';
const router = express.Router();

// SEX ROUTES
router.post('/create/sex', createSex);
router.post('/sex', getSex);
router.get('/sexs', getSexs);
router.patch('/sex', updateSex);
router.patch('/sex/status', toggleStatusSex);
router.delete('/sex', deleteSex);

// NACIONALITY ROUTES
router.post('/create/nacionality', createNacionality);
router.post('/nacionality', getNacionality);
router.get('/nacionalities', getNacionalities);
router.patch('/nacionality', updateNacionality);
router.patch('/nacionality/status', toggleStatusNacionality);
router.delete('/nacionality', deleteNacionality);

// COUNTRY
router.post('/create/country', createCountry);
router.post('/country', getCountry);
router.get('/countries', getCountries);
router.patch('/country', updateCountry);
router.patch('/country/status', toggleStatusCountry);
router.delete('/country', deleteCountry);

// STATUS REQUEST
router.post('/create/status_request', createStatusRequest);
router.post('/status_request', getStatusRequest);
router.get('/statuses_request', getStatusesRequest);
router.patch('/status_request', updateStatusRequest);
router.patch('/status_request/status', toggleStatusRequest);
router.delete('/status', deleteStatusRequest);

// CONTACT
router.post('/create/contact', createContact);
router.get('/contacts', getContacts);
router.post('/contact', getContact);
router.patch('/contact', updateContact);
router.patch('/contact/status', toggleStatusContact);
router.delete('/contact', deleteContact);

//OCCUPATION
router.post('/create/occupation', createOccupation);
router.get('/occupations', getOccupations);
router.post('/occupation', getOccupation);
router.patch('/occupation', updateOccupation);
router.patch('/occupation/status', toggleStatusOccupation);
router.delete('/occupation', deleteOccupation);

// TYPE_OF_TERMINATION
router.post('/create/type_of_termination', createTot);
router.get('/types_of_termination', getTots);
router.post('/type_of_termination', getTot);
router.patch('/type_of_termination', updateTot);
router.patch('/type_of_termination/status', toggleStatusTot);
router.delete('/type_of_termination', deleteTot);

// MODULES
router.post('/create/module', createModule);
router.get('/modules', getModules);
router.post('/modules/profile', getModulesByProfile);
router.post('/module/profile', bindModuleToProfile);
router.delete('/module/profile', unBindModuleToProfile);
router.post('/module', getModule);
router.patch('/module', updateModule);
router.patch('/module/status', toggleStatusModule);
router.delete('/module', deleteModule);

// DOCUMENTS
router.post('/create/document', createDocument);
router.get('/documents', getDocuments);
router.post('/document', getDocument);
router.patch('/document', updateDocument);
router.patch('/document/status', toggleStatusDocument);
router.delete('/document', deleteDocument);

// PROFILE
router.post('/create/profile', createProfile);
router.get('/profiles', getProfiles);
router.post('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/profile/status', toggleStatusProfile);
router.delete('/profile', deleteProfile);

// DEPARTMENT
router.post('/create/department', createDepartment);
router.get('/departments', getDepartments);
router.post('/department', getDepartment);
router.patch('/department', updateDepartment);
router.patch('/department/status', toggleStatusDepartment);
router.delete('/department', deleteDepartment);

// ATTACHMENT TYPES
router.post('/create/attachment', createAttachment);
router.get('/attachments', getAttachments);
router.post('/attachment', getAttachment);
router.patch('/attachment', updatedAttachment);
router.patch('/attachment/status', toggleStatusAttachment);
router.delete('/attachment', deleteAttachment);

// TYPE SUBJECT MESSAGES
router.post('/create/subject', createSubject);
router.get('/subjects', getSubjects);
router.post('/subject', getSubject);
router.patch('/subject', updateSubject);
router.patch('/subject/status', toggleStatusSubject);
router.delete('/subject', deleteSubject);

// NAVIGATION MENU
router.post('/create/navigation_menu', createNavigationMenu);
router.get('/navigation_menus', getNavigationMenus);
router.post('/navigation_menu', getNavigationMenu);
router.patch('/navigation_menu', updatedNavigationMenu);
router.patch('/navigation_menu/status', toggleStatusNavigationMenu);
router.delete('/navigation_menu', deleteNavigationMenu);


const SystemRoutes = {
  router,
};

export default SystemRoutes;
