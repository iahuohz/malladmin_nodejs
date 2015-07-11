/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
	_id: Number,
	name: String,
}, {
		versionKey: false
	});

categorySchema.statics.maxId = function (cb) {
	return this.aggregate({ $project: { _id: 1 } })
		.sort({ _id: -1 }).limit(1)
		.exec(function (err, results) {
			if(results.length){
				cb(results[0]._id);
			} else{
				cb(0);
			}
		});
};

var Category = mongoose.model('Category', categorySchema);
module.exports = Category;