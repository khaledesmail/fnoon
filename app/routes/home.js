module.exports = {
  getHomePage2: (req, res) => {
    res.render('home.ejs', {
      title: 'Welcome to  Fnoon | Login',
    });
  },
};
