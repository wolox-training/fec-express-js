const logger = require('../logger'),
  axios = require('axios'),
  { Purchase } = require('../models'),
  { albumAlreadyPurchased, defaultError } = require('../errors'),
  { getAlbums } = require('../services/albumsApi');

module.exports = {
  list(req, res, next) {
    getAlbums().then(function(albums) {
      return res.status(200).json({ albums });
    });
  },

  buy(req, res, next) {
    const purchase = {
      userId: req.user.id,
      albumId: req.params.id
    };
    Purchase.findOne({ where: purchase })
      .then(p => {
        if (p) {
          next(albumAlreadyPurchased);
        } else {
          return Purchase.create(purchase);
        }
      })
      .then(p => {
        res.status(200).json(p);
      })
      .catch(err => {
        next(defaultError(err.message));
      });
  }
};
