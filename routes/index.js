const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");

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
      res.redirect(`/auth/loginCheck1`);
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

router.get("/profile", loginCheck1(), (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("profile", {
        user: user,
        loggedIn: req.user
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/addTicket", loginCheck2(), (req, res, next) => {
  res.render("addTicket", {
    loggedIn: req.user
  });
});

router.post("/addTicket", loginCheck2(), (req, res, next) => {
  console.log("POST SERVER");
  const { from, until } = req.body;
  Ticket.create({
    availableFrom: req.body.from,
    availableUntil: req.body.until,
    zone: req.body.zone,
    owner: req.user._id,
    ticketId: req.body.ticketId
  })
    .then(() => {
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
  let { from, until, zone } = req.body;

  Ticket.find({
    availableFrom: {
      $lte: from
    },
    availableUntil: {
      $gte: until
    },
    zone: zone
  })
    .then(tickets => {
      console.log("´´´´´´´´´´´´´´´´´´", tickets);
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
      res.redirect("/profile/tickets");
    })
    .catch(err => {
      next(err);
    });
});

router.post("/profile", loginCheck1(), (req, res, next) => {
  const id = req.user.id;
  User.findOneAndUpdate(
    { _id: id },
    {
      gender: req.body.gender,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email
    },
    { new: true }
  )
    .then(updatedUser => {
      res.send(updatedUser);
    })
    .catch(err => console.log(err));
});

router.get(
  "/availableTickets/ticketOverview",
  loginCheck3(),
  (req, res, next) => {
    res.render("ticketOverview", {
      loggedIn: req.user
    });
  }
);

router.get("/about", (req, res) => {
  res.render("about", { loggedIn: req.user });
});

module.exports = router;
