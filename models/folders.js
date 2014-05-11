var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Folder = new Schema({
    url:            { type: String },
    name:           { type: String },
    email:          { type: String },
    phone:          { type: String },
    gravatar:       { type: String },
    repository_id:  { type: String }
});

module.exports = { 
    Folder: mongoose.model('Folder', Folder)
};