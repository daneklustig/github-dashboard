const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    loggedIn: req.user
  });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/loginCheck");
    }
  };
};

router.get("/search", (req, res, next) => {
  res.render("search");
});

router.get("/addTicket", loginCheck(), (req, res, next) => {
  res.render("addTicket", {
    loggedIn: req.user
  });
});

router.post("/addTicket", loginCheck(), (req, res, next) => {
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

router.get("/profile/tickets", loginCheck(), (req, res, next) => {
  const user = req.user;
  Ticket.find({ owner: user })
    .populate("owner")
    .then(tickets => {
      return res.render("myTickets", { tickets: tickets, loggedIn: req.user });
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
