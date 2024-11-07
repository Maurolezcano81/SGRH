import express from 'express';
const router = express.Router();

import NavigationMenuControllers from '../../../controllers/System/Navbar/NavigationMenuControllers.js';
const navbar = new NavigationMenuControllers();

// NAVIGATION MENU ROUTES
router.post('/navigation_menu/create', navbar.createOne.bind(navbar));
router.post('/navigation_menus', navbar.getAllWPagination.bind(navbar));
router.post('/navigation_menus/actives', navbar.getActives.bind(navbar));
router.post('/navigation_menu', navbar.getOne.bind(navbar));
router.patch('/navigation_menu', navbar.updateOne.bind(navbar));
router.patch('/navigation_menu/status', navbar.toggleStatus.bind(navbar));
router.delete('/navigation_menu', navbar.deleteOne.bind(navbar));

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
