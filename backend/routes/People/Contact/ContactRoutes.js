import express from 'express';
const router = express.Router();

import ContactController from '../../../controllers/People/Contact/ContactControllers.js';

const contact = new ContactController();
// CONTACT ROUTES
router.post('/contact/create', contact.createContact.bind(contact));
router.get('/contacts', contact.getContacts.bind(contact));
router.post('/contact', contact.getContact.bind(contact));
router.patch('/contact', contact.updateContact.bind(contact));
router.patch('/contact/status', contact.toggleStatusContact.bind(contact));
router.delete('/contact', contact.deleteContact.bind(contact));

const ContactRoutes = {
  router,
};

export default ContactRoutes;
