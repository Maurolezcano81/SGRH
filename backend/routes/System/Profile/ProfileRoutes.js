import express from 'express';
const router = express.Router();

import ProfileController from '../../../controllers/System/Profile/Profile.js';

const profile = new ProfileController();
// PROFILE ROUTES
router.post('/profile/create', profile.createProfile.bind(profile));
router.post('/profile', profile.getProfile.bind(profile));
router.patch('/profile', profile.updateProfile.bind(profile));
router.patch('/profile/status', profile.toggleStatusProfile.bind(profile));
router.delete('/profile', profile.deleteProfile.bind(profile));

const ProfileRoutes = {
  router,
};

export default ProfileRoutes;
