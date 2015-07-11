var mongoose = require('mongoose');

exports.open = function () {
  var databaseUrl = 'mongodb://localhost/mall';
  var opts = {
    server: {
      socketOptions: { keepAlive: 1 }
    }
  };
  mongoose.connect(databaseUrl, opts, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Mongoose connected.");
    }
  });
};

exports.close = function () {
  mongoose.disconnect(function(err){
    if (err){
      console.log(err);
    } 
  });
};