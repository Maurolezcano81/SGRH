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
import express from 'express';
const router = express.Router();

// SEX ROUTES
router.post('/sex', createSex);
router.get('/sex/:id', getSex);
router.get('/sex', getSexs);
router.patch('/sex/:id', updateSex);
router.patch('/sex/status/:id', toggleStatusSex);
router.delete('/sex/:id', deleteSex);

// NACIONALITY ROUTES
router.post('/nacionality', createNacionality);
router.get('/nacionality/:id', getNacionality);
router.get('/nacionality', getNacionalities);
router.patch('/nacionality/:id', updateNacionality);
router.patch('/nacionality/status/:id', toggleStatusNacionality);
router.delete('/nacionality/:id', deleteNacionality);

// COUNTRY
router.post('/country', createCountry);
router.get('/country/:id', getCountry);
router.get('/country', getCountries);
router.patch('/country/:id', updateCountry);
router.patch('/country/status/:id', toggleStatusCountry);
router.delete('/country/:id', deleteCountry);

// STATUS REQUEST
router.post('/status_request', createStatusRequest);
router.get('/status_request/:id', getStatusRequest);
router.get('/status_request', getStatusesRequest);
router.patch('/status_request/:id', updateStatusRequest);
router.patch('/status_request/status/:id', toggleStatusRequest);
router.delete('/status/:id', deleteStatusRequest);

const SystemRoutes = {
  router,
};

export default SystemRoutes;
