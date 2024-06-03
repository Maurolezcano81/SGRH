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
  updateModule,
  toggleStatusModule,
  deleteModule,
} from '../../controllers/System/ModuleControllers.js';

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
router.post('/module', getModule);
router.patch('/module', updateModule);
router.patch('/module/status', toggleStatusModule);
router.delete('/module', deleteModule);

const SystemRoutes = {
  router,
};

export default SystemRoutes;
