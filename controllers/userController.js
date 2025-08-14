const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')


const filterObj = (obj, ...allowedFields) =>{ 
  const newObj ={};
  Object.keys(obj).forEach(el =>{if(allowedFields.includes(el)) newObj[el] = obj [el]; })
    return newObj;

}

exports.deleteMe = catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active:false})
  res.status(200).json({status:'success', data: null})
})


exports.getAllusers = factory.getAll(User)

exports.updateMe = catchAsync(async (req, res,next) =>{
  // 1) Create error if user trys to post password data
  if (req.body.password || req.body.passwordConfirm){
    return next(new AppError('This route is not for password updates; please use /updatemypassowrd', 400))
  }


  // filtered out unwanted filed names that are not allowed to be updated
   const filteredBody = filterObj(req.body, 'name', 'email');
  // update the user document 
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new:true, runValidators:true
  })

  res.status(200).json({status: 'success', data:{user: updatedUser} })

}) 
exports.deleteUser = factory.deleteOne(User)





exports.getMe = (req,res,next)=> {
  req.params.id= req.user.id
  next()
}





exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);









exports.getUser = factory.getOne(User)





exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};


// D not update password with this 
exports.updateUser = factory.updateOne(User)
