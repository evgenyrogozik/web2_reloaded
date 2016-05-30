require('../models/db');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var loggeduser;

/*Get Home Page*/
module.exports.index = function (req, res) {
	res.render('index',{title: 'MainPage', user: req.user});
};
//static
module.exports.about = function (req, res) {
	res.sendfile('public/static/about.html', {title: 'About'});
};
//static
module.exports.howto = function (req, res) {
	res.sendfile('public/static/howto.html',{title: 'How To Play'});
};
//static
module.exports.references = function (req, res) {
	res.sendfile('public/static/references.html',{title: 'references'});
};
//dynamic
module.exports.game = function (req, res) {
	res.render('game',{title: 'GamePage', user:req.user});
};

//dynamic
module.exports.dynamic_test = function (req, res) {
	res.render('dynamic_test',{title: 'TEST', heading: 'HELLO WORLD', value: 2, description: 'This is description'});
};

module.exports.register = reg;

function reg(req, res) {
	res.render('register',{title: 'Registration'});
};

module.exports.comments = comment;

function comment(req, res) {
    Comment
        .find()
            .sort({date_created: -1})
            .exec(
                function(err, commentData){
                    if(err){
                        res.render('error', {
                        message:err.messagr,
                        error: err
                        });
                    }
                    else{
                        console.log(commentData);
                        console.log('find complete');
                        res.render('comments',{'comms':commentData, user:req.user});
                    }
                });
        }

module.exports.adduser = function(req, res) {

    //var createHash =  bCrypt.hashSync(req.body.pass1, bCrypt.genSaltSync(10), null);
	var newuser = new User({first_name: req.body.given_name, surname: req.body.surname, dob: req.body.dob, email: req.body.email, user_name: req.body.user_name, password: req.body.pass1});
	console.log(newuser);
	newuser.save(function(err, data) {
		if(err) {
			console.log(err);
			res.status(500);
			res.render('error', {
				message:err.message,
				error: err
			});
		}
		else {
            passport.authenticate('local')(req, res, function() {
               console.log(data, ' saved');
                res.redirect('/'); 
            });
		}
	});
}

module.exports.addcomment = function(req, res) {

    var newcomment = new Comment({user_name: req.body.username, message: req.body.message, date_created: Date(), like: 76});
    newcomment.save(function(err, data) {
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
            res.redirect('/comments');
        }
    });
}

module.exports.login = login;

function login(req, res) {
    res.render('login',{title: 'Login Page'});
};


module.exports.userlogin = function(req, res) {
   // var temp = bCrypt.hashSync(req.body.pass, bCrypt.genSaltSync(10), null);
    User.findOne({'user_name': req.body.user_name}, 'user_name surname password', function (err, person) {
        if(err) return console.log(err);
        if(person == null)  return console.log("no such user_name");
        else
        console.log('%s is a %s.', person.user_name, person.surname);
        if(person.password.localeCompare(req.body.pass) == 0) {
            console.log("You are logged in");
            loggeduser = person.user_name;
            res.redirect('/');
        }
        else  return console.log("Password is wrong");
    })
}