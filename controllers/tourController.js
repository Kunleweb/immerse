const Tour = require('./../model/tourModel')



// We create a middleware here to handle all the erro handlers

// exports.checkID = (req, res, next, val)=> {if (req.params.id*1 > tours.length) {
//         return res.status(404).json({status : 'fail', message: 'Invalid ID'})
//     }
//     next()

// }










exports.getAlltours = async (req,res) =>{
    try{
//      BASIC FILTERING
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])






        // ADVANCED FILTERING

        let queryStr = JSON.stringify(queryObj);
        queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
        console.log(JSON.parse(queryStr))
      
        let query =  Tour.find(JSON.parse(queryStr));
        // SORTING

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query =query.sort(req.query.sort);


        }
        else{
            query = query.sort('-createdAt')
        }

        // Field Limiting
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        }else {
            query = query.select('-__v')
        }


        // Pagination 
        const page = req.query.page*1|| 1;
        const limit = req.query.limit*1 || 100;
        const skip = (page-1)*limit;
        query = query.skip(skip).limit(limit)

        if (req.query.page){
            const numTours= await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist')
        }


        // EXECUTE QUERY
        
        





        const tours = await query


        // {difficulty: 'easy', duration:{$gte:5 }}\
        // const tours = Tour.find()
        // .where('duration')
        // .equals(5)
        // .where('difficulty')
        // .equals('easy')
        






        
    res.status(200).json({status:'success',
        results: tours.length,
        data:tours
    })}catch(err){
        res.status(404).json({status: 'fail', message: err})
    }}


exports.gettour = async (req,res)=>{
    try{
        const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success',
        data: {tour}  
    })}catch(err){res.status(404).json({status: 'fail', message:err})


    }
    
    
    
}

exports.addtour = async (req, res) =>{
    try{const Newtour = await Tour.create(req.body);
    res.status(201).json({status:'success', data:{tour:Newtour}}); }catch(err){
        res.status(400).json({status: 'fail', message:err.message})
    }
}


exports.updatetour = async (req,res) =>{

    try{ const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
        {new: true, runValidators: true}); 
        res.status(200).json({status: 'success',
        data: {tour}
    })}catch(err){
        res.status(404).json({status: 'fail', message: err})}}

exports.deletetour = async (req,res)=>{

    try{

        const tour = await Tour.findByIdAndDelete(req.params.id);
    // res.status(204).json({status: 'success',
    //     data: tour, message: 'deleted'
    // })
    }catch(err){
        res.status(404).json({status:'fail', message: err})
    }
}
