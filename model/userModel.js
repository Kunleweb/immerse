const mongoose =require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Userschema =  new mongoose.Schema({


    'name': {require: [true, 'user must have a name'], type:String, maxlength: [100, 'maximum no of characters exceeded!']},
    'email': {require: [true, 'please supply email'], type: String, trim: true, lowercase:true, unique:true, lowercase:true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    'photo':{type:String},
    'password':{type:String, require:[true, 'please enter password'], minlength: 8,
        select:false
    },
    'passwordConfirm':{type:String, require:[true, 'please enter password'],  minlength: 8,
        // This only works on  CREATE and SAVE!!! 
        validate:{validator: function(el){
            return el === this.password;    //abc ====xyz
        },  message : 'password not the same'
    }
    } 

 
})



// Doocument middleware for password hashing ; this only runs this function if password was actually modfied 
Userschema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
// has the pasword with cost of 12 a
    this.password = await bcrypt.hash(this.password, 12);

    //  delete the passwrod confirm field
    this.passwordConfirm = undefined;
    next() 
    



})






const User = mongoose.model('User', Userschema)

module.exports = User



