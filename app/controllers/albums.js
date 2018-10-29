const logger = require('../logger'),
  axios = require('axios'),
  { Purchase } = require('../models'),
  { albumNotFound, albumAlreadyPurchased, defaultError } = require('../errors'),
  { getAlbums, getAlbum } = require('../services/albumsApi');

module.exports = {
  list(req, res, next) {
    getAlbums().then(function(albums) {
      return res.status(200).json({ albums });
    });
  },

  buy(req, res, next) {
    const purchase = {
      user_id: req.user.id,
      albumId: req.params.id
    };
    return getAlbum(purchase.albumId)
      .then(album => {
        if (!album.data || !album.data.id) {
          return next(albumNotFound(purchase.albumId));
        }
        return Purchase.findOne({ where: purchase });
      })
      .then(p => {
        if (p) {
          return next(albumAlreadyPurchased);
        }
        return Purchase.create(purchase);
      })
      .then(p => {
        res.status(200).json(p);
      })
      .catch(err => {
        next(defaultError(err.message));
      });
  }
};
