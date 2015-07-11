/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username : String,
	password : String,
	roles : [String]
}, {
		versionKey: false
	});


var User = mongoose.model('User', userSchema);
module.exports = User;