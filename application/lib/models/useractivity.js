'use strict';

const $ = require(__base + 'lib');

const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({

    id: Number,
    user_id: Number,
    activity: [{
        poll_id: Number,
        activity_type: {
            type: String,
            enum: [
                'Like',
                'Share',
                'Comment',
                'Vote',
            ]
        }
    }],

}, {
    bufferCommands: false, // disable command buffering.
    collection: 'user_activities',
    strict: 'throw',
    versionKey: false,
});