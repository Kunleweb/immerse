const Reviews = require('./../model/reviewModel')


exports.getAllReviews = async(req, res, next)=>{
    const reviews = await Reviews.find();
    res.status(200).json({status: 'Success', data:{reviews}});
}


exports.createReview = async(req, res, next)=>{
    // Allow nester routes here we are still giving option to define if they are not there
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    const newreview = await Reviews.create(req.body);
    res.status(201).json({status: 'Success', data:{review: newreview}});
}


