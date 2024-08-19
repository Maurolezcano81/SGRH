import express from 'express';
const router = express.Router();

import {
  createContact,
  getContact,
  getContacts,
  updateContact,
  toggleStatusContact,
  deleteContact,
} from '../../../controllers/People/Contact/ContactControllers.js';

// CONTACT ROUTES
router.post('/create/contact', createContact);
router.get('/contacts', getContacts);
router.post('/contact', getContact);
router.patch('/contact', updateContact);
router.patch('/contact/status', toggleStatusContact);
router.delete('/contact', deleteContact);

const ContactRoutes = {
  router,
};

export default ContactRoutes;
