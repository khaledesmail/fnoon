// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 3011;
//var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

const path = require('path');
const fileUpload = require('express-fileupload');

/*var db_config = {
  host: '68.66.216.59',
  user: 'mano',
  password: 'sdfdsfdf565tfe',
  database: 'mano_fnon'
};

var db=mysql.createConnection(db_config);

function handleDisconnect() {

  db = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      db.end();
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
      db.end();
   handleDisconnect(); 
    console.log('db error', err);
  });
}

handleDisconnect();
global.db = db;*/

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database
try {
  require('./config/passport')(passport); // pass passport for configuration
} catch (error) {
  console.log('Hi from catch' + error);
}

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/public/assets/img/fnoon-icon.ico'));
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
try {
  require('./app/routes.js')(app, passport); // load our routes and pass in our
} catch (error) {
  console.log('Hi from catch 2 ' + error);
}

//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
