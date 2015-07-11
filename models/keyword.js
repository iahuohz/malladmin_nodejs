/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose');

var keywordSchema = mongoose.Schema(
	{ 
		name: String 
	}, 
	{
		versionKey: false
	}
);

var Keyword = mongoose.model('Keyword', keywordSchema);
module.exports = Keyword;