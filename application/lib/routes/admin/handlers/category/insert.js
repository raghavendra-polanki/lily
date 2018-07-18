'use strict';

const $ = require(__base + 'lib');

const setNamesToLowerCase = (categoryData) => {
  let name = categoryData.name.toLowerCase();

  categoryData.set({
    name: name,
  });
  return categoryData;
};

const processRequest = async (req, res, next) => {
  let categoryData;
  try {
    categoryData = new $.model.Category(req.body);
    categoryData = setNamesToLowerCase(categoryData);
    let currentTimestamp = Date.now();
    categoryData.set({
      created_by: 'initial', // TODO(raghav): Need to be changed when user id's are generated.
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
    });

    // validate category schema.
    await $.utils.validation.validateInstanceSchema(categoryData);
  } catch (err) {
    $.log.Error(err);
    res.status(400).json({status: 'INVALID_ARGUMENT', error: err});
    return;
  }

  try {
    // check if an identically named category already exists.
    let orQuery = [];
    let q = {};
    q['name'] = categoryData.name;
    orQuery.push(q);
    let existingCategory =
        await $.model.Category.findOne({'$or': orQuery}).exec();
    if (existingCategory !== null) {
      $.log.Warning('category with similar name already exists');
      res.status(409).json({
        status: 'ALREADY_EXISTS',
        error: 'a category with identical name already exists'
      });
      return;
    }

    // generate a new category_id.
    let categoryID = await $.act({cmd: 'generate_category_id'});
    categoryData.set({
      id: categoryID.id,
    });

    // save category in database.
    await categoryData.save();

    let returnData = {
      id: categoryData.id,
      name: categoryData.name
    }
    return returnData;
  } catch (err) {
    $.log.Error(err);
    res.status(500).json({status: 'INTERNAL', error: 'something went wrong'});
    return;
  }
};

module.exports = function(req, res, next) {
  processRequest(req, res, next)
  .then((data) => {
    if (data !== undefined) {
      res.status(200).json({status: 'OK', data: data});
    }
  })
  .catch((err) => {
    $.log.Error(err);
    res.status(500).json({status: 'INTERNAL', error: 'something went wrong'});
  });
};
