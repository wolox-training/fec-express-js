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
        expect(res.body).to.have.property('email');
        dictum.chai(res, 'User signup endpoint');
        return User.findOne({ where: { email: res.body.email } }).then(user => {
          expect(user).not.to.be.null;
        });
      });
  });

  it('should fail if email is not from wolox domain', () => {
    const userParams = {
      name: 'Juan Ignacio',
      surname: 'Molina',
      email: 'juanignacio.molina@wolx.com.ar',
      password: 'pussy123'
    };
    return chai
      .request(server)
      .post('/users')
      .send(userParams)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        return User.findOne({ where: { email: userParams.email } }).then(user => {
          expect(user).to.be.null;
        });
      });
  });

  it('should fail if password is less than 8 chars', () => {
    const userParams = {
      name: 'Juan Ignacio',
      surname: 'Molina',
      email: 'juanignacio.molina@wolox.com.ar',
      password: 'pussy12'
    };
    return chai
      .request(server)
      .post('/users')
      .send(userParams)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        return User.findOne({ where: { email: userParams.email } }).then(user => {
          expect(user).to.be.null;
        });
      });
  });

  it('should fail if name missing', () => {
    const userParams = {
      surname: 'Molina',
      email: 'juanignacio.molina@wolox.com.ar',
      password: 'pussy123'
    };
    return chai
      .request(server)
      .post('/users')
      .send(userParams)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        return User.findOne({ where: { email: userParams.email } }).then(user => {
          expect(user).to.be.null;
        });
      });
  });

  it('should fail if password missing', () => {
    const userParams = {
      name: 'Juan Ignacio',
      surname: 'Molina',
      email: 'juanignacio.molina@wolox.com.ar'
    };
    return chai
      .request(server)
      .post('/users')
      .send(userParams)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        return User.findOne({ where: { email: userParams.email } }).then(user => {
          expect(user).to.be.null;
        });
      });
  });

  it('should fail if surname missing', () => {
    const userParams = {
      name: 'Juan Ignacio',
      email: 'juanignacio.molina@wolox.com.ar',
      password: 'pussy123'
    };
    return chai
      .request(server)
      .post('/users')
      .send(userParams)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        return User.findOne({ where: { email: userParams.email } }).then(user => {
          expect(user).to.be.null;
        });
      });
  });

  it('should fail if email missing', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        password: 'pussy123'
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
      });
  });

  it('should fail if email is duped', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        name: 'Federico',
        surname: 'Casares',
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(503);
        expect(err.response.body).to.have.property('message');
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

  it('should fail if wrong password', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: 'notmypass'
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
      });
  });

  it('should fail if not password', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar'
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
      });
  });

  it('should fail if not email', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        password: 'notmypass'
      })
      .catch(err => {
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
        expect(err).not.to.be.null;
      });
  });

  it('should fail if not from wolox domain', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wol.com.ar',
        password: '12345678'
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(422);
        expect(err.response.body).to.have.property('message');
      });
  });
});

describe('/users GET', () => {
  it('should list users', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        expect(res).to.have.status(200);
        return chai
          .request(server)
          .get('/users')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('users');
        dictum.chai(res, 'Users list endpoint');
      });
  });

  it('should fail if invalid token', () => {
    return chai
      .request(server)
      .get('/users')
      .set('authorization', `Bearer 1234123`)
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
      });
  });

  it('should fail if token expired', () => {
    return User.findOne().then(user => {
      const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.session.secret, {
        expiresIn: 0
      });
      return chai
        .request(server)
        .get('/users')
        .set('authorization', `Bearer ${token}`)
        .catch(err => {
          expect(err).not.to.be.null;
          expect(err.response).to.have.status(401);
          expect(err.response).to.be.a.json;
          expect(err.response.body)
            .to.have.property('message')
            .equals('jwt expired');
        });
    });
  });

  it('should fail if no token', () => {
    return chai
      .request(server)
      .get('/users')
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
      });
  });
});

describe('/admin/users POST', () => {
  it('should create user admin successfuly', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .set('authorization', `Bearer ${res.body.token}`)
          .send({
            name: 'Juan Ignacio',
            surname: 'Molina',
            email: 'juanignacio.molina@wolox.com.ar',
            password: 'pussy123'
          });
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        dictum.chai(res, 'User Admin signup endpoint');
        return User.findOne({ where: { email: res.body.email } }).then(user => {
          expect(user).not.to.be.null;
        });
      });
  });

  it('should update user admin successfuly', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .set('authorization', `Bearer ${res.body.token}`)
          .send({
            name: 'Federico',
            surname: 'Casares',
            email: 'federico.casares@wolox.com.ar',
            password: 'noImporta'
          });
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body)
          .to.have.property('admin')
          .equals(true);
      });
  });

  it('should fail if not admin', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.notadmin@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .set('authorization', `Bearer ${res.body.token}`)
          .send({
            name: 'Federico',
            surname: 'Casares',
            email: 'federico.notadmin@wolox.com.ar',
            password: 'noImporta'
          });
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
        return User.findOne({ where: { email: 'federico.notadmin@wolox.com.ar' } }).then(user => {
          expect(user.admin).to.be.equals(false);
        });
      });
  });
});

describe('/users/:id/albums GET', () => {
  it('should list albums of my own', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/users/1/albums')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('albums');
        dictum.chai(res, 'User albums list endpoint');
      });
  });

  it('should list albums of other user with admin rights', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/users/2/albums')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('albums');
        dictum.chai(res, 'User albums list endpoint');
      });
  });

  it('should fail to list albums of other user without admin rights', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.notadmin@wolox.com.ar',
        password: '12345678'
      })
      .then(response => {
        return chai
          .request(server)
          .get('/users/1/albums')
          .set('authorization', `Bearer ${response.body.token}`);
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
        dictum.chai(err.response, 'User albums list endpoint');
      });
  });
});

describe('/users/albums/:id/photos GET', () => {
  it('should list album photos of one of my albums', () => {
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
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/users/albums/7/photos')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('photos');
        photoRequest.isDone();
        dictum.chai(res, 'User album photos list endpoint');
      });
  });

  it('should fail to list album photos if not one of my albums', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/users/albums/1/photos')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .catch(err => {
        expect(err.response).to.have.status(500);
        expect(err.response).to.be.a.json;
        expect(err).not.to.be.null;
      });
  });
});

describe('/users/sessions/invalidate_all POST', () => {
  it('should invalidate sessions created', () => {
    let token = '';
    return chai
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
          .post('/users/sessions/invalidate_all')
          .set('authorization', `Bearer ${token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        dictum.chai(res, 'Invalidate all user sessions endpoint');
        return chai
          .request(server)
          .post('/users/sessions/invalidate_all')
          .set('authorization', `Bearer ${token}`);
      })
      .catch(err => {
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
        expect(err.response.body)
          .to.have.property('message')
          .equals('Token Invalidated');
        expect(err).not.to.be.null;
      });
  });
});
