const axios = require('axios'),
  config = require('../../config').common.externalApi,
  apiClient = axios.create({ baseURL: config.albumApiUrl });

module.exports.getAlbums = () => {
  return apiClient.get('/albums').then(function(response) {
    return response.data.map(album => {
      delete album.userId;
      return album;
    });
  });
};

module.exports.getAlbum = id => {
  return apiClient.get(`/albums/${id}`);
};
