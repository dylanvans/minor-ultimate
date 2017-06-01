var express = require('express');
var homeController = require('../controllers/homeController');
var loginController = require('../controllers/loginController');

var router = express.Router();

router.get('/', homeController.homePage);

router.get('/login', loginController.loginPage);
router.get('/success', loginController.onSuccess);

module.exports = router;
