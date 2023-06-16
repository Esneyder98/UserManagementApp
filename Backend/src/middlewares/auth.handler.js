const jwt = require('jsonwebtoken');
const config = require('../database/config/config');

function checkApiKey(req,res,next) {
    const authHeader = req.headers.authorization;
    const revokedTokens = []; 
    const token = authHeader;
    let verify;
    try {
        const secret = config.development.jwtSecret;
        verify = jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = checkApiKey;