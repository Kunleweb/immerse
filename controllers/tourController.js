const Tour = require("./../model/tourModel");
const catchAsync = require("./../utils/catchAsync");
const APIfeatures = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory')
// We create a middleware here to handle all the erro handlers

// exports.checkID = (req, res, next, val)=> {if (req.params.id*1 > tours.length) {
//         return res.status(404).json({status : 'fail', message: 'Invalid ID'})
//     }
//     next()

// }

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name, price, ratinngsAverage, summary, difficulty";
  next();
};

exports.getAlltours = factory.getAll(Tour)

exports.gettour = factory.getOne(Tour, {path: 'reviews'})

exports.addtour =  factory.createOne(Tour)

exports.updatetour = factory.updateOne(Tour)


exports.deletetour = factory.deleteOne(Tour)
// exports.deletetour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(204).json({status: 'success',
//       data: tour, message: 'deleted'
//   })
// });

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          num: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minprice: { $min: "$price" },
          maxprice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);
    res.status(200).json({ status: "success", data: { stats } });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },

      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
