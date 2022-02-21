'use strict';

module.exports = {
  db: 'mongodb://localhost/node-boilerplate_test',
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  }
};
