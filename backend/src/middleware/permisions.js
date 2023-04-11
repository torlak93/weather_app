const User = require('../models/user');

module.exports = {
     isRoot: async (req, res, next) => {
        try {
            const user = await User.findOne({
                _id: req.user._id
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.role !== 'root') {
                throw new Error('User doesnt have permission to access');
            }

            //req.loggedInUser = user;

            next();
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}