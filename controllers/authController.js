const User = require('./../model/userModel')
const catchAsync = require("./../utils/catchAsync");
const  jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const signToken  = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN} )  
}

exports.signup = catchAsync(async (req, res, next ) =>{
    // const newUser = await User.create(req.body)
// we commented the above out because this returns the entire body in whcih anyone could sign in as an admin?
// this would not allow the user to just input any data.
      const newUser = await User.create({name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordConfirm: req.body.passwordConfirm})  

      const token = signToken(newUser._id )  


    res.status(201).json({status:'sucess',token, data: {user:newUser}})
}) 

exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body
    // we check if email and password exist
    if(!email|| !password){
        return next(new AppError('Please provide email and password', 400))

    }
    // we check if the user exists and uf the password matches
    const user = await User.findOne({ email }).select('+password')
    //  we chec if everything is iok, by sending token to client
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('incorrect email or password', 401))
    }


    const token = signToken(user._id )  
    res.status(200).json({status:'success', token})


})
