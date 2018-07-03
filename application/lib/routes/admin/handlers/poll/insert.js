'use strict';

const $ = require(__base + 'lib');

const processRequest = async (req, res, next) => {
  let pollData;
  try {
    pollData = new $.model.Poll(req.body);

    let currentTimestamp = Date.now();
    let endDate = pollData.end_at;
    if(!pollData.has_end){
        endDate = Infinity;
    }
    pollData.set({
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
      created_by: 'initial', // TODO(Raghav): update when user addition
                             // is enabled.
      is_active: false,
      end_at: endDate,
      social_activity: 0,
    });
    // validate category schema.
    await $.utils.validation.validateInstanceSchema(pollData);
  } catch (err) {
    $.log.Error(err);
    res.status(400).json({status: 'INVALID_ARGUMENT', error: err});
    return;
  }

  try {

    // generate a new category_id.
    let pollID = await $.act({cmd: 'generate_poll_id'});
    pollData.set({
      id: pollID.id,
    });

    let socialActivityID =  await $.act({cmd: 'generate_socialactivity_id'});
    let socialActivityData;
    try {
        socialActivityData = new $.model.Socialactivity();
  
        socialActivityData.set({
            poll_id: pollID.id,
        });

        // validate category schema.
        $.utils.validation.validateInstanceSchema(socialActivityData);
    } catch (err) {
      $.log.Error(err);
      return callback(err, null);
    }

    socialActivityData.set({
        id: socialActivityID.id,
    });
    // save category in database.
    await socialActivityData.save();

    pollData.set({
      social_activity: socialActivityID.id,
    });
    
    // save category in database.
    await pollData.save();
    return pollID;
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
    res.status(500).json({status: 'INTERNAL', error: 'something went wrong.'});
  });
};
