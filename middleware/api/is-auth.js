const jwt = require('jsonwebtoken');
const Helpers = require('../../util/helpers');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        let response = Helpers.sendJson(0,  [],
            [], "NotAuthenticated", {});
        return res.status(401).json(response);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        let response = Helpers.sendJson(0,  [],
            err.toString(), "ServerError", {});
        return res.status(500).json(response);
    }
    if (!decodedToken) {
        let response = Helpers.sendJson(0,  [],
            [], "NotAuthenticated", {});
        return res.status(401).json(response);
    }
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;

    next();
};

