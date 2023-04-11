const express = require('express');
const Users = express.Router();

const UsersController = require('../controllers/user');
const verify = require('../helpers/verifytoken');
const { isRoot } = require('../middleware/permisions');

Users.get('/', verify, isRoot, UsersController.index);

Users.post('/', verify, isRoot, UsersController.newUser);

Users.get('/:userId', verify, UsersController.getUser);

module.exports = Users;