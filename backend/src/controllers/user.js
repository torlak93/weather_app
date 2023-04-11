const User = require('../models/user');
module.exports = {
    index: async (req,res,next) => {
        try{
            const users = await User.find({}).select('-password');
            res.send(users);
        }catch(err){
            res.status(400).send(err);
        }
    },

    newUser: async (req,res,next) => {
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Email already exists');

        //has passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });

        try{
            const saveUser = await user.save();
            res.send(saveUser);
        }catch(err){
            res.status(400).send(err);
        }
    },

    getUser: async (req,res,next) => {
        try{
            const { userId } = req.params;

            if(req.user.role != 'root' && req.user._id != userId){
                return res.status(403).send('You dont have permission to access.');
            }

            const user = await User.findById(userId).select('-password');
            if(!user) return res.status(404).send('User not found');

            res.send(user);
        }catch(err){
            res.status(400).send(err);
        }
    }
}