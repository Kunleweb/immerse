const mongoose= require('mongoose')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./prac')
const port = process.env.PORT || 8000


const server = app.listen(port, ()=> {
    console.log(`listening on port: ${port}`)
})
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



console.log(process.env) 


