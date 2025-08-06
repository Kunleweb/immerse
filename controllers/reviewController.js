const Reviews = require('./../model/reviewModel')


exports.getAllReviews = async(req, res, next)=>{
    const reviews = await Reviews.find();
    res.status(200).json({status: 'Success', data:{reviews}});
}


exports.createReview = async(req, res, next)=>{
    const newreview = await Reviews.create(req.body);
    res.status(201).json({status: 'Success', data:{review: newreview}});
}


