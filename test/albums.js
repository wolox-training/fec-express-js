const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  { albumRequest, albumGetRequest } = require('./mocks');

describe('/albums GET', () => {
  it('should list albums', done => {
    const albumRequestMock = albumRequest();
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        chai
          .request(server)
          .get('/albums')
          .set('authorization', `Bearer ${response.body.token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(err).to.be.null;
            expect(res.body).to.have.property('albums');
            albumRequestMock.isDone();
            dictum.chai(res, 'Albums list endpoint');
            done();
          });
      });
  });

  it('should fail if no auth', done => {
    chai
      .request(server)
      .get('/albums')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.a.json;
        expect(err).not.to.be.null;
        done();
      });
  });
});

describe('/albums/:id POST', () => {
  it('should create a purchase', done => {
    const albumRequestMock = albumGetRequest();
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${response.body.token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(err).to.be.null;
            expect(res.body).to.have.property('userId');
            expect(res.body).to.have.property('albumId');
            albumRequestMock.isDone();
            dictum.chai(res, 'Album purchase endpoint');
            done();
          });
      });
  });

  it('should fail if purchase exists already', done => {
    const albumRequestMock = albumGetRequest();
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${response.body.token}`)
          .then(r => {
            chai
              .request(server)
              .post('/albums/1')
              .set('authorization', `Bearer ${response.body.token}`)
              .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res).to.be.a.json;
                expect(err).not.to.be.null;
                albumRequestMock.isDone();
                done();
              });
          });
      });
  });
});
