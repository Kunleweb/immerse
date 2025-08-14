const Tour = require('../model/tourModel')
const catchAsync = require('./../utils/catchAsync')


exports.getOverview = catchAsync(async (req, res, next)=> {
    // 1) Get tour data from collection
        const tours = await Tour.find();

    // 2) We build our template


    // 3) we rend that templat using tour dat
    res.status(200).render('overview', {title: 'All tours', tours})
    
    })


exports.getTour = catchAsync( async(req,res, next)=>{
    // 1) get the data, for the requested tour (including reviews and guides)
       const tour = await Tour.findOne({slug:req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
       }) 
    // 2) Build template
    // 3) render the data using data from 1
    res.status(200).render('tour', {title: 'The forest Hiker Tour', tour})
})


exports.loginPage = (req, res)=>{

    // 1) respond with the login page temp; 
    res.status(200).render('login', {title: 'Log into your account',})

}


