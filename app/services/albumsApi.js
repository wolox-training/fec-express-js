const axios = require('axios'),
  API_URL = 'https://jsonplaceholder.typicode.com',
  apiClient = axios.create({ baseURL: API_URL });

module.exports.getAlbums = () => {
  return apiClient.get('/albums').then(function(response) {
    return response.data.map(album => {
      delete album.userId;
      return album;
    });
  });
};
