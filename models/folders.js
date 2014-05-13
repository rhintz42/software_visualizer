var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Folder = new Schema({
    hidden:         { type: String },
    name:           { type: String },
    owner_email:    { type: String },
    repository_id:  { type: String },
    type_node: 		{ type: String }, 
    url:            { type: String }
});

module.exports = { 
    Folder: mongoose.model('Folder', Folder)
};
