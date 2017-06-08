const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // So promises are used in mongoose
mongoose.connection.on('error', (err) => {
	console.error(`Mongo error: ${err.message}`);
});

// Import models
require('./models/User');
require('./models/Team');

// Require
const path = require('path');
let http = require('http');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const compression = require('compression');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const sockets = require('./sockets');
require('./handlers/passport');
require('./handlers/leaguevine');

// Config
const app = express();

http = http.createServer(app);
sockets.socketServer(app, http);
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(cookieParser()); // needed for flash messages

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: process.env.SESSION_SECRET,
	key: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Can pass messages to the next request of the user
app.use(flash());

// Add variables to every request of template
app.use((req, res, next) => {
	res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	next();
});

app.use('/', routes);

http.listen(process.env.PORT || 3001, () => {
	console.log('Listening on port 3001');
});
