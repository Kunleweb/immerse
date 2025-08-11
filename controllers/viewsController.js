const Tour = require('../model/tourModel')
const catchAsync = require('./../utils/catchAsync')


exports.getOverview = catchAsync(async (req, res, next)=> {
    // 1) Get tour data from collection
        const tours = await Tour.find();

    // 2) We build our template


    // 3) we rend that templat using tour dat
    res.status(200).render('overview', {title: 'All tours', tours})
    
    
    
    
    })


exports.getTour = (req,res)=>{
    res.status(200).render('tour', {title: 'Tour detail page'})
}        



