const logger = require('../logger');
const axios = require('axios');
const { Purchase } = require('../models');
const { albumAlreadyPurchased, defaultError, dbError, externalApiError } = require('../errors');

module.exports = {
  list(req, res, next) {
    axios
      .get('https://jsonplaceholder.typicode.com/albums')
      .then(function(response) {
        res.status(200).json({
          albums: response.data.map(album => {
            delete album.userId;
            return album;
          })
        });
      })
      .catch(err => next(externalApiError(err)));
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
      .catch(err => next(dbError(err)));
  }
};
