const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  jwt = require('jsonwebtoken'),
  nock = require('nock'),
  config = require('../config').common,
  { User, Purchase } = require('../app/models');

describe('/users POST', () => {
  it('should signup successfuly', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        dictum.chai(res, 'User signup endpoint');
      });
  });

  it('should fail if email is not from wolox domain', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolx.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if password is less than 8 chars', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy12'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if name missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if password missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if surname missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if email missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if email is duped', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Federico',
        surname: 'Casares',
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .end((err, res) => {
        expect(res).to.have.status(503);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('message');
        done();
      });
  });
});

describe('/users/sessions POST', () => {
  it('should signin successfuly', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('expirationDate');
        dictum.chai(res, 'User signin endpoint');
      });
  });

  it('should fail if wrong password', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: 'notmypass'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not password', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not email', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        password: 'notmypass'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not from wolox domain', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wol.com.ar',
        password: '12345678'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(err).not.to.be.null;
        done();
      });
  });
});

describe('/users GET', () => {
  it('should list users', done => {
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
          .get('/users')
          .set('authorization', `Bearer ${response.body.token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(res.body).to.have.property('users');
            dictum.chai(res, 'Users list endpoint');
            done();
          });
      });
  });

  it('should fail if invalid token', done => {
    chai
      .request(server)
      .get('/users')
      .set('authorization', `Bearer 1234123`)
      .end((err, res) => {
        expect(err).not.to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should fail if token expired', done => {
    User.findOne().then(user => {
      const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.session.secret, {
        expiresIn: 0
      });
      chai
        .request(server)
        .get('/users')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(res).to.have.status(401);
          expect(res).to.be.a.json;
          expect(res.body)
            .to.have.property('message')
            .equals('jwt expired');
          done();
        });
    });
  });

  it('should fail if no token', done => {
    chai
      .request(server)
      .get('/users')
      .end((err, res) => {
        expect(err).not.to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('/admin/users POST', () => {
  it('should create user admin successfuly', done => {
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
          .post('/admin/users')
          .set('authorization', `Bearer ${response.body.token}`)
          .send({
            name: 'Juan Ignacio',
            surname: 'Molina',
            email: 'juanignacio.molina@wolox.com.ar',
            password: 'pussy123'
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            dictum.chai(res, 'User Admin signup endpoint');
            done();
          });
      });
  });

  it('should update user admin successfuly', done => {
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
          .post('/admin/users')
          .set('authorization', `Bearer ${response.body.token}`)
          .send({
            name: 'Federico',
            surname: 'Casares',
            email: 'federico.casares@wolox.com.ar',
            password: 'noImporta'
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            done();
          });
      });
  });

  it('should fail if not admin', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.notadmin@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        chai
          .request(server)
          .post('/admin/users')
          .set('authorization', `Bearer ${response.body.token}`)
          .send({
            name: 'Federico',
            surname: 'Casares',
            email: 'federico.casares@wolox.com.ar',
            password: 'noImporta'
          })
          .end((err, res) => {
            expect(err).not.to.be.null;
            expect(res).to.have.status(401);
            expect(res).to.be.a.json;
            done();
          });
      });
  });
});

describe('/users/:id/albums GET', () => {
  it('should list albums of my own', done => {
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
          .get('/users/1/albums')
          .set('authorization', `Bearer ${response.body.token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(res.body).to.have.property('albums');
            dictum.chai(res, 'User albums list endpoint');
            done();
          });
      });
  });

  it('should list albums of other user with admin rights', done => {
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
          .get('/users/2/albums')
          .set('authorization', `Bearer ${response.body.token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(res.body).to.have.property('albums');
            dictum.chai(res, 'User albums list endpoint');
            done();
          });
      });
  });

  it('should fail to list albums of other user without admin rights', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.notadmin@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        chai
          .request(server)
          .get('/users/1/albums')
          .set('authorization', `Bearer ${response.body.token}`)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res).to.be.a.json;
            expect(err).not.to.be.null;
            dictum.chai(res, 'User albums list endpoint');
            done();
          });
      });
  });
});

describe('/users/albums/:id/photos GET', () => {
  it('should list album photos of one of my albums', done => {
    const photoRequest = nock('https://jsonplaceholder.typicode.com/')
      .get('/photos?albumId=7')
      .reply(
        200,
        `[
            {
              "albumId": 1,
              "id": 1,
              "title": "accusamus beatae ad facilis cum similique qui sunt",
              "url": "https://via.placeholder.com/600/92c952",
              "thumbnailUrl": "https://via.placeholder.com/150/92c952"
            }
          ]`
      );
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        return chai
          .request(server)
          .get('/users/albums/7/photos')
          .set('authorization', `Bearer ${response.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('photos');
        photoRequest.isDone();
        dictum.chai(res, 'User album photos list endpoint');
        done();
      });
  });
  it('should fail to list album photos if not one of my albums', done => {
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
          .get('/users/albums/1/photos')
          .set('authorization', `Bearer ${response.body.token}`)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res).to.be.a.json;
            expect(err).not.to.be.null;
            done();
          });
      });
  });
});

describe('/users/sessions/invalidate_all POST', () => {
  it('should invalidate sessions created', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        const token = response.body.token;
        chai
          .request(server)
          .post('/users/sessions/invalidate_all')
          .set('authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            dictum.chai(res, 'Invalidate all user sessions endpoint');
            chai
              .request(server)
              .post('/users/sessions/invalidate_all')
              .set('authorization', `Bearer ${token}`)
              .end((err, res2) => {
                expect(res2).to.have.status(401);
                expect(res2).to.be.a.json;
                expect(res2.body)
                  .to.have.property('message')
                  .equals('Token Invalidated');
                expect(err).not.to.be.null;
                done();
              });
          });
      });
  });
});
