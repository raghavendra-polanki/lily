'use strict';

const $ = require(__base + 'lib');

const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({

    id: Number,
    poll_id: Number,
    comments: [
        {
            commented_by: Number,
            comment: String,
            likes: [
                {
                    liked_by: Number,
                    liked_at: Number,
                }
            ],
            shares: [
                {
                    share_to: String,
                    shared_at:Number,
                }
            ],
            replies: [
                {
                    reply: String,
                    replied_by: Number,
                    replied_at: Number,
                }
            ],
            commented_at: Number,
        }
    ]
}, {
    bufferCommands: false, // disable command buffering.
    collection: 'social_activities',
    strict: 'throw',
    versionKey: false,
});