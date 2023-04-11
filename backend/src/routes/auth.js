const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Auth = express.Router();

Auth.post('/register', async (req, res) => {
  //validation ----------- ONE WAY ------------
  // const {error} = registerValidation(req.body);
  // if(error) return res.status(400).send(error.details[0].message);

  //check it user is already in the db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  //has passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    id: floor(Math.random() * 1000),
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
  });

  console.log(user);

  try {
    const saveUser = await user.save();
    res.send(saveUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

Auth.post('/login', async (req, res) => {
  //check if email is already in the db
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user)
    return res.status(400).send({ message: 'Email or password is wrong.' });

  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign(
    { _id: user._id },
    'process.env.TOKEN_SECRET',
    { expiresIn: '1d' },
    (err, token) => {
      res.send({ token, user });
    }
  );
});

module.exports = Auth;
