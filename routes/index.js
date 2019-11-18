const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const User = require('../models/User')

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
router.get("/profile/tickets", loginCheck2(), (req, res, next) => {
  //res.send('TICKETS')

  const owner = req.user;
  Ticket.find({
      owner
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
    .then(() => {
      //res.send('HE')

      res.redirect(`/profile/tickets`);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/search", loginCheck3(), (req, res, next) => {
  res.render("search", {
    loggedIn: req.user
  });
});


router.get("/profile/:ticketId", (req, res) => {
  // const id = ....
  // Ticket.fondOne(...).then(ticket => ....).catch(err => ...)
});


router.post("/availableTickets", loginCheck3(), (req, res, next) => {
  const {from, until, zone} = req.body;

  Ticket.find({availableFrom: {$gte: 20}, availableUntil: {$lte: 24}, zone: zone })
    .then(tickets => {
      res.render("availableTickets.hbs", {
        tickets: tickets
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/profile/tickets/:ticketId/delete", loginCheck2(), (req, res) => {
  const query = {
    _id: req.params.ticketId
  };

  Ticket.deleteOne(query)
    .then(() => {
      res.redirect("/profile/tickets")
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router;