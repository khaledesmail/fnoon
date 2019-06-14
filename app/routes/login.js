// module.exports = {
//     getHomePage2: (req, res) => {
//         res.render('home.ejs', {
//             title: "Welcome to Socka | Login"
//         });
//     },
// };

module.exports = {
  getLoginPage: (req, res) => {
    res.render('login.ejs', {
      title: 'Welcome to Fnoon | Login',
    });
  },

  login: (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    console.log(email);
    let emailQuery = "SELECT * FROM `users` WHERE email = '" + email + "'";

    db.query(emailQuery, function(error, results, fields) {
      if (error) {
        // console.log("error ocurred",error);
        res.send({
          code: 400,
          failed: 'error ocurred',
        });
      } else {
        // console.log('The solution is: ', results);
        console.log(results);
        if (results.length > 0) {
          if (results[0].password == password) {
            // res.send({
            //     "code": 200,
            //     "success": "login sucessfull"
            // });
            const { getHomePage } = require('../routes/index');
            const {
              addPlayerPage,
              addPlayer,
              deleteReservation,
              editReservation,
              editReservationPage,
              displayReservationPage,
            } = require('./reservation');
            app.get('/home', getHomePage);
            app.get('/add', addPlayerPage);
            app.get('/edit/:id', editReservationPage);
            app.get('/display/:id', displayReservationPage);
            app.get('/delete/:id', deleteReservation);
            app.post('/add', addPlayer);
            app.post('/edit/:id', editReservation);
            // app.post('/home',function(req,res){
            //     var month = req.body.selectpicker
            //     console.log('month is', month)
            //     res.send(month)
            // })
            res.redirect('/home');
          } else {
            // res.send({
            //     "code": 204,
            //     "success": "Email and password does not match"
            // });
            res.redirect('/login');
          }
        } else {
          // res.send({
          //     "code": 204,
          //     "success": "Email does not exits"
          // });
          res.redirect('/login');
        }
      }
    });
  },
};
