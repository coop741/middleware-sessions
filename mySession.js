const sessions = {};
let nextSessionId = 1;

module.exports = (req, res, next) => {
  function createSession() {
    const session = {};
    sessions[nextSessionId] = session;
    req.session = session;
    res.cookie("sessionId", nextSessionId);
    nextSessionId++;
  }

  if (req.headers.cookie) {
    // go get session
    const sessionId = req.headers.cookie.split("=")[1];
    const session = sessions[sessionId];
    if (!session) {
      createSession();
    } else {
      req.session = session;
    }
  } else {
    createSession();
  }
  next();
};
