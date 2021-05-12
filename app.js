const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const path = require('path');
const userRoutes = require('./routes/user-routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./middlewares/passport-config');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');

if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

function setupApp() {
	app.set('views', __dirname + '/public/views');
	app.set('view-engine', 'ejs');
	app.use(bodyParser.urlencoded({extended:false}));
	app.use('/public', express.static('public'));
	app.use(fileUpload());
	const sessionConfig = {secret: process.env.SESSION, resave:true, saveUninitialized:true};
	app.use(session(sessionConfig));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use('/', userRoutes);
}

setupApp();
app.listen(port, () => console.log(`listening on... ${port}`));