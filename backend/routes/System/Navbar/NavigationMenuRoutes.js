import express from 'express';
const router = express.Router();

import {
  createNavigationMenu,
  getNavigationMenu,
  getNavigationMenus,
  updatedNavigationMenu,
  toggleStatusNavigationMenu,
  deleteNavigationMenu,
} from '../../../controllers/System/Navbar/NavigationMenuControllers.js';

// NAVIGATION MENU ROUTES
router.post('/create/navigation_menu', createNavigationMenu);
router.get('/navigation_menus', getNavigationMenus);
router.post('/navigation_menu', getNavigationMenu);
router.patch('/navigation_menu', updatedNavigationMenu);
router.patch('/navigation_menu/status', toggleStatusNavigationMenu);
router.delete('/navigation_menu', deleteNavigationMenu);

const NavigationMenuRoutes = {
  router,
};

export default NavigationMenuRoutes;
