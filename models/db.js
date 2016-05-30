var mongoose = require('mongoose');

var dbURL = 'mongodb://localhost/test1db';
mongoose.connect(dbURL);

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURL);
});
mongoose.connection.on('error', function (err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

require('./standings_model.js');
require('./comments_model.js');
require('./person.js');
require('./chat.js');