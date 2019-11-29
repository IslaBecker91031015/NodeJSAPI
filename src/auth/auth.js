const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //decode and verify
    try{
        // get token from header - remove Bearer with split
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.data = decode;
        next(); // continue
    // catch error
    } catch (err) {
        return res.status(401).json({
               message: 'Auth Failed'
        });
    }
}