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
      updated_at: currentTimestamp,
    });
    // validate category schema.
    // await $.utils.validation.validateInstanceSchema(pollData);
 
    console.log(pollData.id);
    // save category in database.

   await $.model.Poll.findOne({ id: pollData.id }, function (err, doc){
      doc.question = pollData.question;
      doc.desc = pollData.desc;
      doc.choices = pollData.choices;
      doc.ref = pollData.ref;
      doc.media = pollData.media;
      doc.categories = pollData.categories;
      doc.updated_at = pollData.updated_at;
      // doc.visits.$inc();
      doc.save();
    });
    return pollData;
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
