const mongoose= require('mongoose')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})


process.on('uncaughtException', (err)=>{
    console.log(err.name, err.message);
    console.log('shutting down...uncaught exception');
    server.close( ()=>{process.exit(1)}
        )

});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false}).then(
    ()=>console.log('DB connection succesful')
)


process.on('unhandledRejection', (err)=>{
    console.log(err.name, err.message);
    console.log('shutting down')
    server.close( ()=>{process.exit(1)}
        );
})






// const tourSchema = new mongoose.Schema({
//     name: {type:String, required:[true, ' A tour must have a name'], unique: true},
//     rating: {type: Number, default: 4.5},
//     price: {type: Number, required: [true, 'A tour must have a price']}
// }); 

// // const Tour = mongoose.model('Tour', tourSchema)

// const testTour = new Tour({
//     name: ' The Forest Hiker 2',
//     rating: 4.7,
//     price: 497
// })

// testTour.save().then(doc=>{console.log(doc)}).catch(err=>{console.log('ERROR!')})

const app = require('./prac')

console.log(process.env) 

const port = process.env.PORT || 8000
app.listen(port, ()=> {
    console.log(`listening on port: ${port}`)
})




