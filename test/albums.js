const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  { Purchase } = require('../app/models'),
  { albumRequest, albumGetRequest } = require('./mocks'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('/albums GET', () => {
  it('should list albums', () => {
    const albumRequestMock = albumRequest();
    const promise = chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/albums')
          .set('authorization', `Bearer ${res.body.token}`);
      });
    return expect(promise).to.be.fulfilled.then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.a.json;
      expect(res.body).to.have.property('albums');
      albumRequestMock.isDone();
      dictum.chai(res, 'Albums list endpoint');
    });
  });

  it('should fail if no auth', () => {
    const promise = chai.request(server).get('/albums');
    return expect(promise).to.be.rejected.then(() => {
      return promise.catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
      });
    });
  });
});

describe('/albums/:id POST', () => {
  it('should create a purchase', () => {
    const albumRequestMock = albumGetRequest();
    const promise = chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${res.body.token}`);
      });
    return expect(promise).to.be.fulfilled.then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.a.json;
      expect(res.body).to.have.property('userId');
      expect(res.body).to.have.property('albumId');
      dictum.chai(res, 'Album purchase endpoint');
      albumRequestMock.isDone();
      return Purchase.findOne({
          where: {
            userId: res.body.userId,
            albumId: res.body.albumId
          }
        }).then(purchase => {
          expect(purchase).not.to.be.null;
        });
    });
  });

  it('should fail if purchase exists already', () => {
    let token = '';
    const albumRequestMock = albumGetRequest();
    const promise = chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        token = res.body.token;
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${token}`);
      })
      .then(res => {
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${token}`);
      });
    return expect(promise).to.be.rejected.then(() => {
      return promise.catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(503);
        expect(err.response).to.be.a.json;
        albumRequestMock.isDone();
      });
    });
  });
});
