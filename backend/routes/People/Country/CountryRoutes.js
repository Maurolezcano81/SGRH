import express from 'express';
const router = express.Router();

import CountryController from '../../../controllers/People/Country/CountryControllers.js';
const country = new CountryController();
// COUNTRY ROUTES
router.post('/country/create', country.createCountry.bind(country));
router.post('/country', country.getCountry.bind(country));
router.get('/countries', country.getCountries.bind(country));
router.patch('/country', country.updateCountry.bind(country));
router.patch('/country/status', country.toggleStatusCountry.bind(country));
router.delete('/country', country.deleteCountry.bind(country));

const CountryRoutes = {
  router,
};

export default CountryRoutes;
