const router = require("express").Router();
const Sequelize = require('sequelize');
const { User, Bird } = require("../models");

router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/home');
    return;

  }
  res.render("loginbody", {
    layout: "login",
  });
});

//✔️ gets 8 random cards
router.get("/home", async (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  try {
    const dbBirdData = await Bird.findAll({ order: Sequelize.literal('rand()'), limit: 8 }).then((encounters) => {
      const birdRandomCards = []
      for (let i = 0; i < encounters.length; i++) {
        let thisBird = encounters[i].get({ plain: true })
        birdRandomCards.push(thisBird)
      }
      console.log('thisBird', birdRandomCards)
      res.render('birdcard', {
        layout: 'main',
        birdsArr: birdRandomCards,
        user_id: req.session.username,
      });
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✔️
router.get("/singlebird/:id", async (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  try {
    const birdsData = await Bird.findByPk(req.params.id);
    const singleBirdData = birdsData.get({ plain: true });
    res.render('singlebird', {
      layout: 'main',
      ...singleBirdData,
    });
  } catch (err) {
    console.log(err)
  }
});

router.get("/home", async (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    console.log(userData)
    const userArr = userData.map((user) => user.get({ plain: true }));
    console.log(userArr)
    res.render('username', {
      layout: 'main',
      userArr: userArr,
      loggedIn: true
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/home', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  const { user: { username } = {} } = req;
  res.render('main', {
    username,
  });
});

// router.get('/home', (req, res) => {
//   User.findAll({
//     attributes: { exclude: ['password'] },
//     where: {
//       user_id: req.session.user_id
//     },
//     include: [
//       {
//         model: User,
//         attributes: ['username']
//       }
//     ]
//   });
//   const user = userData.get({ plain: true });
//   res.render('username', {
//     user,
//     loggedIn: true

//   })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

router.get('/homeall', async (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  try {
    const dbBirdData = await Bird.findAll({});
    const birdPlain = dbBirdData.map((bird) => bird.get({ plain: true }))

    birdPlain.sort(function (a, b) {
      if (a.bird_name < b.bird_name) { return -1; }
      if (a.bird_name > b.bird_name) { return 1; }
      return 0;
    })

    res.render('allbirds', {
      layout: 'main',
      birdsArr: birdPlain,

    });
    // for (let i = 0 ; i < birdPlain.length; i++) {
    // console.log(birdPlain)
    // }




    // res.status(200).json(birdPlain);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get("/newbird", (req, res) => {
  // if (!req.session.user_id) {
  //   res.redirect("/")
  // }
  res.render("newbird", {
    layout: "main",
  });
});

router.get('/forgot', (req, res) => {
  res.render('forgotpassword', {
    layout: 'forgot',
  });
})

router.get("/termsofservice", (req, res) => {
  res.render("termsofservice", {
    layout: "terms",
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    layout: "terms",
  });
});

router.get("/map", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/")
  }
  res.render("map", {
    layout: "main",
  });
});

router.get("/delete", (req, res) => {
  res.render("secretdelete", {
    layout: "terms",
  });
});


module.exports = router;
