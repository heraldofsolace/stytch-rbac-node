const SESSION_DURATION_MINUTES = 60;
const SESSION_COOKIE = "stytch_session_jwt";

function setSession(req, res, sessionJWT) {
  res.cookie(SESSION_COOKIE, sessionJWT, {
    httpOnly: true,
    maxAge: 1000 * 60 * SESSION_DURATION_MINUTES, // minutes to milliseconds
  });
}

function clearSession(req, res) {
  res.clearCookie(SESSION_COOKIE);
}

function getSession(req, res) {
    const session = req.cookies[SESSION_COOKIE];
    if (session) {
      return {
        session,
        error: false,
      };
    }
    return { error: true };
  }
  

function revokeSession(req, res, stytchClient) {
  const sessionJWT = req.cookies[SESSION_COOKIE];
  if (!sessionJWT) {
    return;
  }
  // Delete the session cookie by setting maxAge to 0
  res.cookie(SESSION_COOKIE, "", { maxAge: 0 });
  // Call Stytch in the background to terminate the session
  // But don't block on it!
  stytchClient.sessions
    .revoke({ session_jwt: sessionJWT })
    .then(() => {
      console.log("Session successfully revoked");
    })
    .catch((err) => {
      console.error("Could not revoke session", err);
    });
}

module.exports = {
  SESSION_DURATION_MINUTES,
  setSession,
  getSession,
  clearSession,
  revokeSession
}
