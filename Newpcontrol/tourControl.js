const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));



exports.getalltours = (req, res) =>{
    res.status(200).json({status: 'success', 
        results: tours.length,
        data: {tours}
    })
}
exports.gettour = (req, res) => {
    const id = req.params.id* 1;
     if (id > tours.length){return res.status(404).json({status:
        'fail', message: 'Invalid ID'
    })}
    const tour = tours.find(el => el.id == id);
    res.status(200).json({status: 'success', data:{tour}})
}

exports.createTour = (req, res) =>{
    const Newid = tours[tours.length-1].id +1
    const Newtour = Object.assign({id: Newid}, req.body)
    tours.push(Newtour);
    fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`, JSON.stringify(tours),err=>{
        res.status(201).json({status: 'success', data:{tours :Newtour}})
    })

}