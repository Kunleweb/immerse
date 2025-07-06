const Tour = require('./../model/tourModel')



// We create a middleware here to handle all the erro handlers

// exports.checkID = (req, res, next, val)=> {if (req.params.id*1 > tours.length) {
//         return res.status(404).json({status : 'fail', message: 'Invalid ID'})
//     }
//     next()

// }










exports.getAlltours = async (req,res) =>{
    try{
        const tours = await Tour.find();
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


exports.updatetour = (req,res)=>{

    res.status(200).json({status: 'success',
        data: '...The file has been updated'
    })
}

exports.deletetour = (req,res)=>{


    res.status(204).json({status: 'success',
        data: null
    })
}
