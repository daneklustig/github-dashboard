const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedIn: req.user
  });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  };
};

router.get('/search', (req, res, next) => {
  res.render('search')
})

router.get('/addTicket', loginCheck(), (req, res, next) => {
  res.render('addTicket')
})

module.exports = router;