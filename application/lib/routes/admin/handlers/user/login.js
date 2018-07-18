'use strict';

const $ = require(__base + 'lib');

const processRequest = async (req, res, next) => {

  try {

    let searchKey;
    let dbUserData = null;

    if(req.body.user_souce == 'mobile'){
        searchKey = req.body.mob_nos[0];
        dbUserData = await $.model.User.findOne({mob_nos: [searchKey]},{'_id': 0});
        dbUserData.is_return_user = true;
    }else{
        searchKey = req.body.email_ids[0];
        dbUserData = await $.model.User.findOne({email_ids: [searchKey]},{'_id': 0});
        dbUserData.is_return_user = true;
    }

    if(dbUserData == null){
        let userData = new $.model.User(req.body);

        let currentTimestamp = Date.now();
    
        userData.set({
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
          is_active: false,
        });

        await $.utils.validation.validateInstanceSchema(userData);

        await userData.save();

        if(req.body.user_souce == 'mobile'){
            searchKey = userData.mob_nos[0];
            dbUserData = await $.model.User.findOne({mob_nos: [searchKey]},{'_id': 0});
        }else{
            searchKey = userData.email_ids[0];
            dbUserData = await $.model.User.findOne({email_ids: [searchKey]},{'_id': 0});
        }
        dbUserData.is_return_user = false;
    }
    return dbUserData;
  } catch (err) {
    $.log.Error(err);
    res.status(400).json({status: 'INVALID_ARGUMENT', error: err});
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
    res.status(500).json({status: 'INTERNAL', error: 'something went wrong.'});
  });
};
