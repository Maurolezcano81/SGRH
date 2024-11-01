import express from 'express';
const router = express.Router();

import AttachmentControllers from '../../../controllers/People/Attachment/AttachmentType.js';
// ATTACHMENT TYPES
const attachment = new AttachmentControllers()
router.post('/attachment/create', attachment.createOne.bind(attachment));
router.post('/attachments', attachment.getAllWPagination.bind(attachment));
router.post('/attachment', attachment.getOne.bind(attachment));
router.patch('/attachment', attachment.updateOne.bind(attachment));
router.patch('/attachment/status', attachment.toggleStatus.bind(attachment));
router.delete('/attachment', attachment.deleteOne.bind(attachment));

const AttachmentRoutes = {
  router
}

export default AttachmentRoutes;