const Reviews = require('./../model/reviewModel')
const factory = require('./handlerFactory')


exports.getAllReviews = async(req, res, next)=>{
    let filter = {}
    if (req.params.tourId) filter = {tour:req.params.tourId}
    // so we are filtering in our respinse so that only the tour with that particular id is shown
    // else if not specified it will show all as usual; this way we dont need two controllers
    const reviews = await Reviews.find(filter);
    res.status(200).json({status: 'Success', data:{reviews}});
}


exports.setTourUserIds = (req, res,next) => {
        if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next()
}
exports.createReview = factory.createOne(Reviews)

exports.deleteReview = factory.deleteOne(Reviews)
exports.updateReview = factory.updateOne(Reviews)
