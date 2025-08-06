// review/rating/createdAt/ ref to tour. ref to user and whar not
const Tour = require('./../model/tourModel')
const User = require('./../model/userModel')
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    review: {type: String, required:[true, 'please add review']},
    rating: {required:[true, 'A review must have a rating'],
         type: String, min:1, max:5 
     }, 
        createdAt: {type: Date, default:Date.now()},

        user: {type: mongoose.Schema.ObjectId, ref: User, required: [true, 'Review must belong to a User']},
        tour: {type: mongoose.Schema.ObjectId, ref: Tour, required: [true, 'Review must belong to a tour']},    
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)





// Document middleware


// ReviewSchema.pre('save', async function(next){
//     const users = this.user.map(id =>User.findById(id));
//     this.user = await Promise.all(users);
//     next()
// })




// ReviewSchema.pre('save', async function(next){
//     const tours = this.tour.map(id =>Tour.findById(id));
//     this.tour = await Promise.all(tours);
//     next()
// })

ReviewSchema.pre(/^find/, function(next){
    this.populate({path: 'tour', select: 'name photo'});
    next()
})




const Review = mongoose.model('Review', ReviewSchema)
module.exports = Review