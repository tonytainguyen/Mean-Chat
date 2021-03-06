/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

var messageValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 500],
        message: 'Messages should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var MessageSchema = new mongoose.Schema({
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    username: {
    	type: String
    },
    message: {
        type: String,
        required: true,
        trim: true,
        validate: messageValidator
    },
    resource_type: {
        type: String,
        required: true
    },
    // Upvotes and downvotes hold an array of user ids that have voted
    _upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    _downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    time: {
    	type: Date
    }
});

mongoose.model('Message', MessageSchema);
