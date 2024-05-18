import { createSex, getSex, getSexs, updateSex, toggleStatusSex, deleteSex } from '../controllers/SexControllers.js';
import {
  createNacionality,
  getNacionality,
  getNacionalities,
  updateNacionality,
  toggleStatusNacionality,
  deleteNacionality,
} from '../controllers/NacionalityControllers.js';
import {
  createCountry,
  getCountry,
  getCountries,
  updateCountry,
  toggleStatusCountry,
  deleteCountry,
} from '../controllers/CountryControllers.js';
import {
  createStatusRequest,
  getStatusRequest,
  getStatusesRequest,
  updateStatusRequest,
  toggleStatusRequest,
  deleteStatusRequest,
} from '../controllers/StatusRequestControllers.js';

import {
  createContact,
  getContact,
  getContacts,
  updateContact,
  toggleStatusContact,
  deleteContact,
} from '../controllers/ContactControllers.js';

import express from 'express';
const router = express.Router();

// SEX ROUTES
router.post('/sex', createSex);
router.get('/sex', getSex);
router.get('/sexs', getSexs);
router.patch('/sex', updateSex);
router.patch('/sex/status', toggleStatusSex);
router.delete('/sex', deleteSex);

// NACIONALITY ROUTES
router.post('/nacionality', createNacionality);
router.get('/nacionality', getNacionality);
router.get('/nacionalities', getNacionalities);
router.patch('/nacionality', updateNacionality);
router.patch('/nacionality/status', toggleStatusNacionality);
router.delete('/nacionality', deleteNacionality);

// COUNTRY
router.post('/country', createCountry);
router.get('/country', getCountry);
router.get('/countries', getCountries);
router.patch('/country', updateCountry);
router.patch('/country/status', toggleStatusCountry);
router.delete('/country', deleteCountry);

// STATUS REQUEST
router.post('/status_request', createStatusRequest);
router.get('/status_request/:id', getStatusRequest);
router.get('/status_request', getStatusesRequest);
router.patch('/status_request/:id', updateStatusRequest);
router.patch('/status_request/status/:id', toggleStatusRequest);
router.delete('/status/:id', deleteStatusRequest);

// CONTACT 
router.post('/contact', createContact);
router.get('/contacts', getContacts);
router.get('/contact', getContact);
router.patch('/contact', updateContact);
router.patch('/contact/status', toggleStatusContact);
router.delete('/contact', deleteContact);


const SystemRoutes = {
  router,
};

export default SystemRoutes;
