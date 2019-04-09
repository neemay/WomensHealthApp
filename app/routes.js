// app/routes.js
module.exports = function(app, passport) {
  //Index page
  app.get('/', function(req, res) {
    res.render('pages/index', { title: 'Obie Home', loginMessage: req.flash('loginMessage'), signupMessage: req.flash('signupMessage') });
  });

  //Dashboard page
  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('pages/dashboard', { title: 'Obie Dashboard', user: req.user });
  });

  //Profile page
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('pages/profile', { title: 'My Profile', user: req.user });
  });

  //History page
  app.get('/history', isLoggedIn, function(req, res) {
    res.render('pages/history', { title: 'My History', user: req.user });
  });
  
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/dashboard',
    failureRedirect : '/#login',
    failureFlash : true
  }));
  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/dashboard',
    failureRedirect : '/#signup',
    failureFlash : true
  }));
  
};

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}