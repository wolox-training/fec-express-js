const logger = require('../logger'),
  { Purchase } = require('../models'),
  { albumNotFound, albumAlreadyPurchased, defaultError, dbError, externalApiError } = require('../errors'),
  albumsApi = require('../services/albumsApi');

module.exports = {
  list(req, res, next) {
    return albumsApi
      .getAlbums()
      .then(albums => {
        return res.status(200).json({ albums });
      })
      .catch(err => next(externalApiError(err)));
  },

  buy(req, res, next) {
    const purchase = {
      userId: req.user.id,
      albumId: req.params.id
    };
    return albumsApi
      .getAlbum(purchase.albumId)
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
      .catch(err => next(dbError(err)));
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
  },
  albumPhotosList(req, res, next) {
    const purchase = {
      userId: req.user.id,
      albumId: req.params.id
    };
    Purchase.findOne({ where: purchase }).then(p => {
      if (!p) {
        next(defaultError('Album has not been purchased.'));
      } else {
        albumsApi.getPhotos(p.albumId).then(photos => {
          res.status(200).json({ photos });
        });
      }
    });
  }
};
