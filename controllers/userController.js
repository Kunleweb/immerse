const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError')


const filterObj = (obj, ...allowedFields) =>{ 
  const newObj ={};
  Object.keys(obj).forEach(el =>{if(allowedFields.includes(el)) newObj[el] = obj [el]; })
    return newObj;

}




exports.getAllusers = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY

  const users = await User.find();

  res
    .status(200)
    .json({ status: "success", results: users.length, data: {users} });
});


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


exports.deleteMe = catchAsync(async(req, res, next)=> {
              await User.findByIdAndUpdate(req.user.id,{active: false})

              res.status(204).json({status:'success', data:null})

})




















exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  } res.status(200).json({status: "success", data: { tour }});
});





exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};