const express = require('express');

const app = express();




app.get('/', (req, res)=>{

    res.status(404).json({message:'Hello from the server side!', app: 'Natours'});
})

app.post('/', (req,res)=>{
    res.send(`app runiing on port: ${port}`)
})





const port = 3000
app.listen(3000,  ()=>{
    console.log(`app running on ${port}`)
})

