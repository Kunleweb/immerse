const crypto = require('crypto');
const {promisify} = require('util');
const User = require('./../model/userModel')
const catchAsync = require("./../utils/catchAsync");
const  jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')
const signToken  = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN} )  
}


// const createSendToken = (user, statusCode, res) =>{
//      const token = signToken(user._id )  
//      const cookieOptions = {
//       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
//       secure:true, httpOnly:true, 

//      }
//      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
//      res.cookie('jwt', token, cookieOptions)
//     res.status(statusCode).json({status:'success', token, data: {user} })
// }

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};



exports.signup = catchAsync(async (req, res, next ) =>{
    // const newUser = await User.create(req.body)
// we commented the above out because this returns the entire body in whcih anyone could sign in as an admin?
// this would not allow the user to just input any data.
      const newUser = await User.create({name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        
    }) 
    createSendToken(newUser, 201, res)
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
        return next(new AppError('incorrect email or password', 401))}

   createSendToken( user, 200, res)


})



    




exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});




exports.restrictTo = (...roles) => {
    return (req, res, next) =>{
        // roles is an array , so when a user has a role in the array then they 
        // then they get permission, if there is not in the array then they do not get permission
        // remember that our protect middleware will run before this as specified in tourroute
        // this means we are using current user
        if(!roles.includes(req.user.role)){
            return next(new AppError('You don not habve permission to perfomr this action', 403))
        }
        next()
    }
}



exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});



exports.resetPassword = catchAsync(
    async (req, res, next)=>{  
    // 1) Get User based on the token 

    // here were encrytpinh the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt:Date.now()}})



    // 2) Set the new password but only if the token has not expired and ther is a user

    if (!user){
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update Chnaged Password at property for the current user
    // 4) Log the user in, send the JWT to the client
  createSendToken(user, 200, res)

  }
 ) 
    
 
// how i did it
//  exports.updatePassword =   catchAsync (async (req, res, next) =>{
//     // 1) Get the user from the collection;
//     const user = await User.findOne()
//     // 2) We need to check if the posted password is correct
//     const {password, newpassword} = req.body;
//     if(!password === user.password){return next(new AppError('incorrect old password', 401))}

//     // 3) If the password is correct then update it 
//     else(user.password === newpassword);
//     await user.save()

//     // 4) Log user in, Send JWT 
//     const token = signToken(user._id )  
//     res.status(200).json({status:'success', token})

//  })


exports.updatePassword = catchAsync(async(req, res, next)=>{
    // 1) Get the user from the collection;
    const user = await User.findById(req.user.id).select('+password')

    // so here we basically select the password field and and return it 
    // with the query results which is the user document. 

    // 2) We want to check if the posted password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('your current password is wrong', 401))
    }

    // 3)if so update the passsword
    user.password = req.body.password;
    user.passwordConfirm= req.body.passwordConfirm;
    await user.save(); 
    // User.findbyIDandUpdate will not work as intended!

createSendToken(user, 200, res)
})


