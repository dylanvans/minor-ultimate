const express = require('express');
const homeController = require('../controllers/homeController');
const teamController = require('../controllers/teamController');
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const todoController = require('../controllers/todoController');
const gameController = require('../controllers/gameController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', catchErrors(homeController.homePage));
router.get('/my-team', loginController.isLoggedIn, catchErrors(teamController.myTeam));
router.get('/info', homeController.infoPage);

router.get('/login', userController.loginPage);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);
router.get('/register', catchErrors(userController.registerForm));
router.post('/register', 
	userController.validateRegister,
	catchErrors(userController.register),
	loginController.login
);

router.get('/success', loginController.onSuccess);

router.get('/game/:id', catchErrors(gameController.gamePage));
router.post('/game/:id/update-score', catchErrors(gameController.updateScore));

router.get('/spirit-points/:id', loginController.isLoggedIn, catchErrors(todoController.spiritPoints));
router.post('/spirit-points/:id', loginController.isLoggedIn, catchErrors(todoController.submitPoints));

router.get('/team/:name', catchErrors(teamController.teamPage));

router.get('/starred', loginController.isLoggedIn, catchErrors(teamController.starPage));

router.get('/crew', homeController.crew);
router.post('/tournament-update', homeController.tournamentUpdate);

// API
router.post('/api/teams/:id/star', catchErrors(teamController.starTeam));

module.exports = router;
