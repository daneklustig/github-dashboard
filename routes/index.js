const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    loggedIn: req.user
  });
});

const loginCheck1 = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/profile/:userId");
    }
  };
};

const loginCheck2 = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/loginCheck2");
    }
  };
};

const loginCheck3 = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/loginCheck3");
    }
  };
};

router.get("/search", loginCheck3(), (req, res, next) => {
  res.render("search"), {
    loggedIn: req.user
  };
});

router.get("/addTicket", loginCheck2(), (req, res, next) => {
  res.render("addTicket", {
    loggedIn: req.user
  });
});

router.post("/addTicket", loginCheck2(), (req, res, next) => {
  console.log("POST SERVER");
  Ticket.create({
      availableFrom: req.body.from,
      availableUntil: req.body.until,
      zone: req.body.zone,
      owner: req.user._id,
      ticketId: req.body.ticketId
    })
    .then(ticket => {
      res.redirect(`/profile/tickets`);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/profile/:userId", loginCheck1(), (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      res.render("profile", {
        user: user,
        loggedIn: req.user
      })
    })
    .catch(err => {
      next(err)
    });
})

router.get("/profile/tickets", loginCheck1(), (req, res, next) => {
  const user = req.user;
  Ticket.find({
      owner: user
    })
    .populate("owner")
    .then(tickets => {
      return res.render("myTickets", {
        tickets: tickets,
        loggedIn: req.user
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/profile/:ticketId", (req, res) => {
  // const id = ....
  // Ticket.fondOne(...).then(ticket => ....).catch(err => ...)
});

module.exports = router;