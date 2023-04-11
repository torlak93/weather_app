const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = function (req,res,next){
    // ONE WAY
    // const token = req.header('auth-token');
    // if(!token) return res.status(401).send('Access Denied');

    // try{
    //     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //     req.user = verified;
    //     next();
    // } catch (err) {
    //     res.status(400).send('Invalid Token');
    // }

    //SECOND WAY

    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //console.log(bearerHeader);
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;

        jwt.verify(req.token, 'process.env.TOKEN_SECRET', async (err, authData) => {
            if(err) {
                res.status(400).send('Invalid Token');
            } else {
                try{
                    const user = await User.findById(authData._id).select('-password');

                    if (!user) {
                        throw new Error('User not found.')
                    }
    
                    req.user = user;
                    next();
                    
                } catch(err) {
                    console.log(err);
                    res.status(500).send(err.message);
                }
            }
        });
        // try{
        //     const verified = jwt.verify(req.token, process.env.TOKEN_SECRET);
        //     req.user = verified;
        //     next();
        // } catch (err) {
        //     res.status(400).send('Invalid Token');
        // }

        //next();
    } else {
        // forbidden
        res.sendStatus(403);
    }
}