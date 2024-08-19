import express from 'express';
const router = express.Router();

import {
    createAttachment,
    getAttachment,
    getAttachments,
    updatedAttachment,
    toggleStatusAttachment,
    deleteAttachment,
  } from '../../../controllers/People/Attachment/AttachmentType.js';

  // ATTACHMENT TYPES
router.post('/create/attachment', createAttachment);
router.get('/attachments', getAttachments);
router.post('/attachment', getAttachment);
router.patch('/attachment', updatedAttachment);
router.patch('/attachment/status', toggleStatusAttachment);
router.delete('/attachment', deleteAttachment);

const AttachmentRoutes = {
    router
}

export default AttachmentRoutes;