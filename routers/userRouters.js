const express = require('express')
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router();


route.post('/signup', authController.signup); 
route.post('/login', authController.login); 


router.route('/')
.get(userController.getAllusers)
.post(userController.createUsers);

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)


module.exports = router