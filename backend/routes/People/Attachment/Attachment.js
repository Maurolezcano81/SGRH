import express from 'express';
const router = express.Router();

import AttachmentControllers from '../../../controllers/People/Attachment/AttachmentType.js';
  // ATTACHMENT TYPES
const attachment = new AttachmentControllers()
router.post('/attachment/create', attachment.createAttachment.bind(attachment));
router.get('/attachments', attachment.getAttachments.bind(attachment));
router.post('/attachment', attachment.getAttachment.bind(attachment));
router.patch('/attachment', attachment.updateAttachment.bind(attachment));
router.patch('/attachment/status', attachment.toggleStatusAttachment.bind(attachment));
router.delete('/attachment', attachment.deleteAttachment.bind(attachment));

const AttachmentRoutes = {
    router
}

export default AttachmentRoutes;