const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));




// We create a middleware here to handle all the erro handlers

exports.checkID = (req, res, next, val)=> {if (req.params.id*1 > tours.length) {
        return res.status(404).json({status : 'fail', message: 'Invalid ID'})
    }
    next()

}


exports.checkbody = (req, res, next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(404).json(
            {status: 'fail',
                message: 'Missing name or price'
            }
        )
    } next()
}










exports.getAlltours = (req,res) =>{
    console.log('req.requestTime')
    res.status(200).json({status:'success', requested: req.requestTime,
        results: tours.length,
        data:tours
    })
}

exports.gettour = (req,res)=>{
    const id = req.params.id*1;
    const tour = tours.find(el =>el.id == id); 
    res.status(200).json({ status: 'success',
        data: {tour}
        
    })
}

exports.addtour = (req, res) =>{ 
    const Newid = tours[tours.length-1].id + 1;
    const Newtour = Object.assign({id: Newid}, req.body);
    tours.push(Newtour);
    fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`,
         JSON.stringify(tours), err =>{
            res.status(201).json({status:'success', data:{ tours: Newtour}})
         })}

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
