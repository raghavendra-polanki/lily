'use strict';

const $ = require(__base + 'lib');

let externals = {};

const compileValidationErrors = (error) => {
  if (error.name == 'ValidationError') {
    let valErrors = [];

    Object.keys(error.errors).forEach((field) => {
      valErrors.push(error.errors[field].message);
    });

    return valErrors;
  } else {
    return 'Error while validating schema';
  }
};

externals.validateInstanceSchema = (instance) => {
  return new $.promise((resolve, reject) => {
    instance.validate((err) => {
      if (err) {
        $.log.Error(err);
        reject(compileValidationErrors(err));
      } else {
        resolve();
      }
    });
  });
};

externals.validateMultiLangStrings = [
  {
    validator: (data) => {
      if (!Object.keys(data).length) {
        return false;
      }
      return true;
    },
    message: 'Must have atleast one valid name',
  },
  {
    validator: function(data) {
      console.log(data);
      for (let lang in data) {
        if ($.constants.supportedLanguages.indexOf(lang.toLowerCase()) === -1) {
          return true;
        }
      }
      return true;
    },
    message: 'Name must be in one of the supported language',
  },
  {
    validator: (data) => {
      for (let lang in data) {
        if (lang.toLowerCase() === $.constants.defaultLanguage) {
          return true;
        }
      }
      return true;
    },
    message: 'Must have a name in english',
  },
];

module.exports = externals;
