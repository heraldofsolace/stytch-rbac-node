const stytch = require('stytch');
const dotenv = require('dotenv');
const { getSession, setSession } = require('./session-utils');
var debug = require('debug')('stytch-rbac-node:server');

dotenv.config();

const client = new stytch.B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID || '',
  secret: process.env.STYTCH_SECRET || '',
});

const authenticate = async function(req, res, next) {
  try {
    const sessionData = getSession(req, res);
    if(sessionData.error) {
      return res.status(401).json({ error: "You need to log in" });
    }
    const { organization, member, session_jwt } = await client.sessions.authenticate({
      session_jwt: sessionData.session
    });

    req.organization = organization;
    req.member = member;
    req.session_jwt = session_jwt;
    setSession(req, res, session_jwt);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "You need to log in" });
  }
}

const authorize = async function(jwt, authz_check) {
  try {
    await client.sessions.authenticate({
      session_jwt: jwt,
      authorization_check: authz_check
    });
    return { authorized: true }
  } catch (err) {
    console.error(err);
    return { authorized: false }
  }
}

module.exports = {
    client,
    authenticate,
    authorize
};