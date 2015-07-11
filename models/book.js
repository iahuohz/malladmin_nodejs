/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	title: String,
	isbn: String,
	authors:[{country:String, name: String}],
	category: Number,
	publisher:String,
	publishdate: Date,
	keywords: [String],
	edition: Number,
	listprice: Number,
	reducedprice: Number,
	pages: Number,
	status: Number,
	pictureUrl:String,
	description:String
}, {
		versionKey: false
	});

var Book = mongoose.model('Book', bookSchema);
module.exports = Book;