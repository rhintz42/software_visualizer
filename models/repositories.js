var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Repository = new Schema({
    url:        { type: String },
    name: {
        first:  { type: String },
        last:   { type: String }
    },  
    email:      { type: String },
    phone:      { type: String },
    gravatar:   { type: String }
});

module.exports = { 
    Repository: mongoose.model('Repository', Repository)
};