module.exports = function(app, passport) {
  const { getHomePage } = require('../app/routes/profile');
  // const { getHomePage2 } = require('../routes/home');
  // const { getLoginPage, login } = require('../routes/login');
  const {
    addReservationPage,
    addStagePage,
    addTeacherPage,
    addReservation,
    addStage,
    addTeacher,
    deleteReservation,
    editReservation,
    editReservationPage,
    displayReservationPage,
  } = require('./routes/reservation');
  app.get('/profile', isLoggedIn, getHomePage);
  app.get('/stage', addStagePage);
  app.get('/reservation', addReservationPage);
  app.get('/teacher', addTeacherPage);
  app.get('/edit/:id', isLoggedIn, editReservationPage);
  app.get('/display/:id', isLoggedIn, displayReservationPage);
  app.get('/delete/:id', isLoggedIn, deleteReservation);
  app.post('/stage', addStage);
  app.post('/teacher', addTeacher);
  app.post('/reservation', addReservation);
  app.post('/edit/:id', isLoggedIn, editReservation);

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user,
      title: 'Welcome to Socka | Login',
    });
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      title: 'Welcome to Fnoon | Login',
    });
  });

  // process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
  );

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
      title: 'Welcome to Fnoon | Login',
    });
  });

  // process the signup form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
  );

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });
  app.post(
    '/connect/local',
    passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
  );

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.email = undefined;
    user.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
