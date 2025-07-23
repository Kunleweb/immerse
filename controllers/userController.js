const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");


exports.getAllusers = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY

  const users = await User.find();

  res
    .status(200)
    .json({ status: "success", results: users.length, data: {users} });
});

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