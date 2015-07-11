/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose');

var publisherSchema = mongoose.Schema(
	{ 
		name: String 
	}, 
	{
		versionKey: false
	}
);

var Publisher = mongoose.model('Publisher', publisherSchema);
module.exports = Publisher;