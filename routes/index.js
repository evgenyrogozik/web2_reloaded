require('../models/db');
var express = require('express');
var mongoose = require('mongoose');
//new
var passport = require('passport');
var Account = require('../models/account');
var Score = mongoose.model('standing');
//old
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlPerson = require('../controllers/person');
var db = 'mongodb://localhost/test1db';

/* GET home page. */
router.get('/', ctrlMain.index);

router.get('/about.html', ctrlMain.about)
router.get('/howto.html', ctrlMain.howto)

router.get('/references.html', ctrlMain.references)

router.get('/game', ctrlMain.game)
router.get('/comments', ctrlMain.comments)
router.post('/addcomment', ctrlMain.addcomment);

/* add simple home page. */
//router.post('/', ctrlMain.index);

/* delete simple */
router.get('/delete/:id', ctrlPerson.deletePerson);

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.get('/score_upd', function(req, res) {
    Score
        .find()
            .sort({win_rate: -1})
            .exec(
                function(err, scores){
                    if(err){
                        res.render('error', {
                        message:err.messagr,
                        error: err
                        });
                    }
                    else{
                        console.log(scores);
                        console.log('find complete');
                        res.render('score_upd',{'score':scores, user:req.user});
                    }
                });
        });

router.post('/register', function(req, res) {
  Account.
  register(new Account({first_name: req.body.given_name, surname: req.body.surname, dob: req.body.dob, email: req.body.email, username : req.body.username }), 
    req.body.password, 
    function(err, account) {
     if (err) {
       return res.render('register', { account : account });
     }
     passport.authenticate('local')(req, res, function () {
       res.redirect('/');
     });
   });
});

router.get('/win', function(req, res) {
  var user = req.user;

  Score
  .findOne({ user_name:  user.username})
  .exec(
    function(err, scoreData){
      if(err){
        res.render('error', {
          message:err.messagr,
          error: err
        });
      }
      else{
        console.log(scoreData);
        //create new entry
        if(scoreData == null) {
          console.log('empty');
          //========================================================
          var score = new Score({user_name: user.username, total_wins:1, total_looses:0, win_rate:100});
          console.log(score);
          score.save(function(err, data) {
            if(err) {
              console.log(err);
              res.status(500);
              res.render('error', {
                message:err.message,
                error: err
              });
            }
            else {
             console.log(data, ' saved');
             res.redirect('/score_upd');
           }
         });
        }
        //update current entry
        else{
          var up_wins = scoreData.total_wins+1;
          var rate = (up_wins/(up_wins+scoreData.total_looses))*100;

          var query = {user_name: user.username};
          var update = {total_wins: up_wins, win_rate: rate};
          var options = {new: true};
          Score.findOneAndUpdate(query, update, options, function(err, person) {
            if (err) {
              console.log('got an error');
            }
            else {
             console.log('NOT empty');
             console.log(scoreData.total_wins);
             res.redirect('/score_upd');
           }
          });
        }
      }
});
});

router.get('/lose', function(req, res) {
  var user = req.user;

  Score
  .findOne({ user_name: user.username})
  .exec(
    function(err, scoreData){
      if(err){
        res.render('error', {
          message:err.messagr,
          error: err
        });
      }
      else{
        console.log(scoreData);
        //create new entry
        if(scoreData == null) {
          console.log('empty');
          //========================================================
          var score = new Score({user_name: user.username, total_wins:0, total_looses:1, win_rate: 0});
          console.log(score);
          score.save(function(err, data) {
            if(err) {
              console.log(err);
              res.status(500);
              res.render('error', {
                message:err.message,
                error: err
              });
            }
            else {
             console.log(data, ' saved');
             res.redirect('/score_upd');
           }
         });
        }
        //update current entry
        else{
          var up_looses = scoreData.total_looses+1;
          var rate = (scoreData.total_wins/(scoreData.total_wins+up_looses))*100;

          var query = {user_name: user.username};
          var update = {total_looses: up_looses, win_rate: rate};
          var options = {new: true};
          Score.findOneAndUpdate(query, update, options, function(err, person) {
            if (err) {
              console.log('got an error');
            }
            else {
             console.log('NOT empty');
             res.redirect('/score_upd');
           }
          });
        }
      }
});
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.get('/chat', function(req, res) {
  res.render('chat', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(req.get('referer'));
});

module.exports = router;
