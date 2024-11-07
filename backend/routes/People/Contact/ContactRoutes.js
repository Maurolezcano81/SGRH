import express from 'express';
const router = express.Router();

import ContactController from '../../../controllers/People/Contact/ContactControllers.js';

const contact = new ContactController();
// CONTACT ROUTES
router.post('/contact/create', contact.createOne.bind(contact));
router.post('/contacts', contact.getAllWPagination.bind(contact));
router.post('/contact', contact.getOne.bind(contact));
router.patch('/contact', contact.updateOne.bind(contact));
router.patch('/contact/status', contact.toggleStatus.bind(contact));
router.delete('/contact', contact.deleteOne.bind(contact));

const ContactRoutes = {
  router,
};

export default ContactRoutes;
