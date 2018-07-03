'use strict';

const $ = require(__base + 'lib');

const Mongoose = require('mongoose');
module.exports = new Mongoose.Schema({
  id: String, // not adding 'required' validator because validations will be
              // running before generating 'id' to avoid dangling ids in
              // database in case of validation fails.
  is_active: {
    type: Boolean,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  ref: { 
    type: [
      String,
    ],
  },
  media: {
    type: [
      String,
    ],
  },
  categories: [
    Number,
  ],
  choices: [
    {
      title: {
        type: String,
        require: true,
      },
      media: [
        String,
      ],
      votes: [
        {
          user_id: String,
          timeStamp: Number,
        }
      ],
    
    },
  ],
  has_end:{
    type: Boolean,
    required: true,
  },
  end_at:{
    type:Number,
    required: true,
  },
  social_activity:{
    type: Number,
    required: true,
  },
  created_by:{
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Number,
    required: true,
  },
}, {
  bufferCommands: false, // disable command buffering.
  collection: 'polls',
  strict: 'throw',
  versionKey: false,
});

/**
  * Indices:
  *
  * db.videos.createIndex({"id": 1}, {unique: true});
  */
