import express from 'express';
const router = express.Router();

import AuditControllers from '../../controllers/Audit/AuditControllers.js';

const audit = new AuditControllers();
// SUBJECT ROUTES
router.post('/audit', audit.getAllWPagination.bind(audit));


const AuditRoutes = {
    router,
};

export default AuditRoutes;
