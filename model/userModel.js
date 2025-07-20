const mongoose =require('mongoose')

const Userschema =  new mongoose.Schema({

    'name': {require: [true, 'user must have a name'], type:String, maxlength: [100, 'maximum no of characters exceeded!']},
    'email': {require: [true, 'please supply username'], type: String, trim: true, lowercase:true, unique:true},
    'photo':{type:data},
    'password':{require:[true, 'please enter password'], type:Number},
    'passwordConfirm':{require:[true, 'please enter password'], type:Number } 


})