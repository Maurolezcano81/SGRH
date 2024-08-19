import express from 'express';
const router = express.Router();

import {
  createCountry,
  getCountry,
  getCountries,
  updateCountry,
  toggleStatusCountry,
  deleteCountry,
} from '../../../controllers/People/Country/CountryControllers.js';

// COUNTRY ROUTES
router.post('/create/country', createCountry);
router.post('/country', getCountry);
router.get('/countries', getCountries);
router.patch('/country', updateCountry);
router.patch('/country/status', toggleStatusCountry);
router.delete('/country', deleteCountry);

const CountryRoutes = {
  router,
};

export default CountryRoutes;
