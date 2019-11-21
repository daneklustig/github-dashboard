const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login1", (req, res, next) => {
  res.render("auth/login1", {
    message: req.flash("error")
  });
});

router.post(
  "/login1",
  passport.authenticate("local", {
    successRedirect: `/profile`,
    failureRedirect: "/auth/login1",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/login2", (req, res, next) => {
  res.render("auth/login2", {
    message: req.flash("error")
  });
});

router.post(
  "/login2",
  passport.authenticate("local", {
    successRedirect: "/addTicket",
    failureRedirect: "/auth/login2",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/login3", (req, res, next) => {
  res.render("auth/login3", {
    message: req.flash("error")
  });
});

router.post(
  "/login3",
  passport.authenticate("local", {
    successRedirect: "/search",
    failureRedirect: "/auth/login3",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne(
    {
      username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser
        .save()
        .then(() => {
          req.login(newUser, err => {
            if (err) next(err);
            else res.redirect("/profile");
          });
        })
        .catch(err => {
          res.render("auth/signup", {
            message: "Something went wrong"
          });
        });
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// router.get("/loginCheck1", (req, res) => {
//   res.redirect("auth/loginCheck1");
// });

router.get("/loginCheck2", (req, res) => {
  res.render("auth/loginCheck2");
});

router.get("/loginCheck3", (req, res) => {
  res.render("auth/loginCheck3");
});

module.exports = router;
