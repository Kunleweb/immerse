const Reviews = require('./../model/reviewModel')
const factory = require('./handlerFactory')


exports.getAllReviews =factory.getAll(Reviews)


exports.setTourUserIds = (req, res,next) => {
        if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next()
}

exports.createReview = factory.createOne(Reviews)

exports.deleteReview = factory.deleteOne(Reviews)
exports.updateReview = factory.updateOne(Reviews)
exports.getReview = factory.getOne(Reviews)

