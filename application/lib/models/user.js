'use strict';

const $ = require(__base + 'lib');

const Mongoose = require('mongoose');

module.exports = new Mongoose.Schema({
  id: String,
  is_active: Boolean,
  user_type: {
    type: String,
    enum: [
      'admin',
      'generic'
    ],
  },
  user_source:{
    type: String,
    enum: [
      'mobile',
      'google',
      'facebook'
    ],
  },
  source_id: {
    type: String,
  },
  source_token: {
    type: String,
  },
  name:{
      first: String,
      middle: String,
      last: String,
    },
  mob_nos: [
    {
      code: Number,
      num: Number,
    },
  ],
  email_ids: [
    String,
  ],
  profile_img: String,
  categories: [
    String, // these are category_ids.
  ],
  birthday: {
    day: Number,
    month: Number,
    year: Number
  },
  age_group: {
    type: String,
    enum: [
      '13 to 18',
      '18 to 21',
      '21 to 25',
      '25 to 30',
      '30 to 50',
      'above 50',
    ],
  },
  gender: {
    type: String,
    enum: [
      'MALE',
      'FEMALE',
      'OTHER',
    ],
  },
  user_activity: {
    acitivity_id: Number,
  },
  // TODO(surenderthakran): structure user derived data.
  created_at: Number,
  updated_at: Number,
}, {
  bufferCommands: false, // disable command buffering.
  collection: 'users',
  strict: 'throw',
});
