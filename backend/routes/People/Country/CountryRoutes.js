import express from 'express';
const router = express.Router();

import CountryController from '../../../controllers/People/Country/CountryControllers.js';
const country = new CountryController();
// COUNTRY ROUTES
router.post('/country/create', country.createOne.bind(country));
router.post('/countries', country.getAllWPagination.bind(country));
router.post('/country', country.getOne.bind(country));
router.patch('/country', country.updateOne.bind(country));
router.delete('/country', country.deleteOne.bind(country));

const CountryRoutes = {
  router,
};

export default CountryRoutes;
