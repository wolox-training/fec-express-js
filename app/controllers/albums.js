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
      userId: req.user.id,
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
  },
  albumList(req, res, next) {
    if (!req.user.admin && req.user.id !== parseInt(req.params.id)) {
      return res.status(401).json({ message: 'User is not an admin.' });
    }
    Purchase.findAll({ where: { userId: req.params.id } }).then(purchases => {
      res.status(200).json({
        albums: purchases.map(p => {
          return { id: p.albumId };
        })
      });
    });
  }
};
