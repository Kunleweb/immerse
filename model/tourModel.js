const mongoose= require('mongoose'); 
const slugify = require('slugify');
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {type:String, required:[true, ' A tour must have a name'], unique: true,
        trim: true, maxlength: [40, 'A tour name must have less than 40 characters'],
        minlength: [10, 'more or equal than 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug : String,
    duration:{
        type: String,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {values:['easy', 'medium', 'difficult'], message: 'Difficulty is easy, medium, difficult'}},
    ratingsAverage: {type: Number, default: 4.5, min: [1, 'rating must be above 1.0'],
         max: [5, 'rating must be below 5']},
    
    ratingsQuantity: {
        type: Number,
        default: 0

    },
    price: {type: Number, required: [true, 'A tour must have a price']},
    priceDiscount: {type:Number, 
       validate:{ validator: function(val){
        // This only points to current doc on NEW document creation
            return val < this.price 
        }, message: 'Discount price ({VALUE}) should be below the regular price'}
    },
    summary: {
        type:String,
        trim: true, 
        required: [true, 'A tour must have a a description']  

    },
    description: {
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, ' A tour must have a cover image']
    },
    images:[String], 
    createdAt:{
        type: Date, 
        default: Date.now(),
        select: false
    }, 
    startDates: [Date], 
    secretTour:{type: Boolean, 
    default: false
}
},
{

    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}

); 



tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})


// Document midelleware: runs before .save() and .create() does not wwork if it is .insertmany
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();

})


// tourSchema.pre('save', function(next){
//     console.log('will save document...')
//     next()
// })

// tourSchema.post('save', function(doc, next){
//     console.log(doc); 
//     next()
// })


// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne:true}})
    this.start = Date.now();
    next()
})
 
// At post, query has executed; we therefor have access to docs and we specify it in the function
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now()- this.start} milliseconds`);
    // console.log(docs);
    next();
    this.find({secretTour:{$ne:true}})
    next()
})
 
 
// AGGREGATION MIDDLEWARE 
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
    console.log(this.pipeline());
    next()
})




const Tour = mongoose.model('Tour', tourSchema)

module.exports= Tour

