import express from 'express';
const router = express.Router();

import NavigationMenuControllers from '../../../controllers/System/Navbar/NavigationMenuControllers.js';
const navbar = new NavigationMenuControllers();

// NAVIGATION MENU ROUTES
router.post('/navigation_menu/create', navbar.createNavigationMenu.bind(navbar));
router.post('/navigation_menus', navbar.getNavigationMenus.bind(navbar));
router.post('/navigation_menu', navbar.getNavigationMenu.bind(navbar));
router.patch('/navigation_menu', navbar.updateNavigationMenu.bind(navbar));
router.patch('/navigation_menu/status', navbar.toggleStatusNavigationMenu.bind(navbar));
router.delete('/navigation_menu', navbar.deleteNavigationMenu.bind(navbar));

router.post('/menu/parents', navbar.getMenuParentsByIdProfile.bind(navbar));

router.post('/menu/navbar/parents', navbar.getMenuParentsByIdMenu.bind(navbar));
router.post('/menu/navbar/childrens', navbar.getMenuChildrensByIdParent.bind(navbar))

router.post('/menu/navbar/childrens/add', navbar.createChildrenParent.bind(navbar));
router.delete('/menu/navbar/childrens/delete', navbar.deleteChildrenParent.bind(navbar))

router.post('/menu/navbar/parents/add', navbar.createParentMenu.bind(navbar));
router.patch('/menu/navbar/parents/update', navbar.updateParentMenu.bind(navbar));
router.delete('/menu/navbar/parents/delete', navbar.deleteParentMenu.bind(navbar));

router.post('/menu/navbar/childrens/get/:id_nm', navbar.getChildrensToAdd.bind(navbar))


router.post('/menu/childrens', navbar.getMenuChildrensByIdProfileAndIdParent.bind(navbar));

const NavigationMenuRoutes = {
  router,
};

export default NavigationMenuRoutes;
