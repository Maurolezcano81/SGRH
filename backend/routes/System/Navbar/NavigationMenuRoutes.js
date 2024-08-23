import express from 'express';
const router = express.Router();

import NavigationMenuControllers from '../../../controllers/System/Navbar/NavigationMenuControllers.js';
const navbar = new NavigationMenuControllers();

// NAVIGATION MENU ROUTES
router.post('/navigation_menu/create', navbar.createNavigationMenu.bind(navbar));
router.get('/navigation_menus', navbar.getNavigationMenus.bind(navbar));
router.post('/navigation_menu', navbar.getNavigationMenu.bind(navbar));
router.patch('/navigation_menu', navbar.updateNavigationMenu.bind(navbar));
router.patch('/navigation_menu/status', navbar.toggleStatusNavigationMenu.bind(navbar));
router.delete('/navigation_menu', navbar.deleteNavigationMenu.bind(navbar));

router.post('/menu/parents', navbar.getMenuParentsByIdProfile.bind(navbar));
router.post('/menu/childrens', navbar.getMenuChildrensByIdProfileAndIdParent.bind(navbar));

const NavigationMenuRoutes = {
  router,
};

export default NavigationMenuRoutes;
