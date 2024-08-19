import express from 'express';
const router = express.Router();

import {
  createProfile,
  getProfile,
  getProfiles,
  updateProfile,
  toggleStatusProfile,
  deleteProfile,
} from '../../../controllers/System/Profile/Profile.js';

// PROFILE ROUTES
router.post('/create/profile', createProfile);
router.get('/profiles', getProfiles);
router.post('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/profile/status', toggleStatusProfile);
router.delete('/profile', deleteProfile);

const ProfileRoutes = {
  router,
};

export default ProfileRoutes;
