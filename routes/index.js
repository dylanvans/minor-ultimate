const express = require('express');
const homeController = require('../controllers/homeController');
const teamController = require('../controllers/teamController');
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const gameController = require('../controllers/gameController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', homeController.homePage);
router.get('/my-team', teamController.myTeam);

router.get('/login', userController.loginPage);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);
router.get('/register', userController.registerForm);
router.post('/register', 
	userController.validateRegister,
	catchErrors(userController.register),
	loginController.login
);

router.get('/success', loginController.onSuccess);

router.get('/game/:id', gameController.gamePage);

module.exports = router;
