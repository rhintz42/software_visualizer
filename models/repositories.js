var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Repository = new Schema({
    url:        	{ type: String },
    name:       	{ type: String },
    owner_username: { type: String },
    owner_email:    { type: String },
    is_public: 		{ type: Boolean }
});

module.exports = { 
    Repository: mongoose.model('Repository', Repository)
};