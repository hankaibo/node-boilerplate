'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL,
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://example.herokuapp.com/auth/github/callback'
  }
};
