import { createSex, getSex, getSexs, updateSex, toggleStatusSex, deleteSex } from "../controllers/SexControllers.js";

import express from 'express';
const router = express.Router();

// SEX ROUTES
router.post('/sex', createSex);
router.get('/sex/:id', getSex);
router.get('/sex', getSexs);
router.patch('/sex/:id', updateSex);
router.patch('/sex/status/:id', toggleStatusSex);
router.delete('/sex/:id', deleteSex);


const SystemRoutes = {
    router
}

export default SystemRoutes;