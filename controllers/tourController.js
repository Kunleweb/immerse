const Tour = require('./../model/tourModel')



// We create a middleware here to handle all the erro handlers

// exports.checkID = (req, res, next, val)=> {if (req.params.id*1 > tours.length) {
//         return res.status(404).json({status : 'fail', message: 'Invalid ID'})
//     }
//     next()

// }










exports.getAlltours = (req,res) =>{
    console.log('req.requestTime')
    // res.status(200).json({status:'success', requested: req.requestTime,
    //     results: tours.length,
    //     data:tours
    // })
}

exports.gettour = (req,res)=>{
    const id = req.params.id*1;
    // const tour = tours.find(el =>el.id == id); 
    // res.status(200).json({ status: 'success',
    //     data: {tour}
        
    // })
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
