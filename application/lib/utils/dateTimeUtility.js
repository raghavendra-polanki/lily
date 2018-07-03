'use strict';

const Moment = require('moment-timezone');

let externals = {};

/**
 * CurrentYYMMDD returns the current date's year and month in YYMMDD
 * format.
 *
 * @return {string}
 */
externals.CurrentYYMMDD = () => {
  return Moment().tz('Asia/Kolkata').format('YYMMDD');
};

externals.LogTime = () => {
  return Moment().tz('Asia/Kolkata').format('YY-MM-DD HH:mm:ss.SS');
};

module.exports = externals;
