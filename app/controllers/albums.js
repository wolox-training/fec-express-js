const logger = require('../logger');
const axios = require('axios');
const { Purchase } = require('../models');
const { albumAlreadyPurchased, defaultError } = require('../errors');

module.exports = {
  list(req, res, next) {
    axios.get('https://jsonplaceholder.typicode.com/albums').then(function(response) {
      res.status(200).json({
        albums: response.data.map(album => {
          delete album.userId;
          return album;
        })
      });
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
