'use strict';

const $ = require(__base + 'lib');

const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  id: String, // not adding 'required' validator because validations will be
              // running before generating 'id' to avoid dangling ids in
              // database in case of validation fails.
  name: String,
  created_by: {
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
  collection: 'categories',
  strict: 'throw',
  versionKey: false,
});

/**
  * Indices:
  *
  * db.categories.createIndex({"id": 1}, {unique: true});
  */
