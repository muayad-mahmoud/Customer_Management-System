var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = new Schema({
    bname: String,
    company: String,
    taxNo: Number,
    PName: String,
    PPhone: Number,
    Location: String,
    StartDate: Date,
    EndDate: Date,
    Logo: String,
    Images: Array
});

module.exports = mongoose.model('users', userModel);
