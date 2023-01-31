const express = require('express');
const router = express.Router();
const Leaderboard = require('./models/leaderboard');

router.post('/leaderboard', (req, res) => {
  const leaderboard = new Leaderboard({
    userName: req.body.userName,
    score: req.body.score
  });

  leaderboard.save()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;