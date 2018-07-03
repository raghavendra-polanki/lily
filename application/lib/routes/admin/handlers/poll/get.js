'use strict';

const $ = require(__base + 'lib');

const processRequest = async (req, res, next) => {
  try {
    if (req.query.id !== undefined) {
      // get poll from database.
      let poll = await $.model.Poll.findOne({id: req.query.id},
                                                    {'_id': 0});

      if (poll === null) {
        $.log.Warning('no such poll exists');
        res.status(404).json({
          status: 'NOT_FOUND',
          error: 'no such poll exists',
        });
        return;
      }
      return poll;
    } else {
      $.log.Warning('need a valid poll id');
      res.status(400).json({
        status: 'INVALID_ARGUMENT',
        error: 'need a valid poll id',
      });
      return;
    }
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
