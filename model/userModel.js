const crypto = require('crypto')
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
    "role":{type:String, enum:['user', 'guide', 'lead-guide', 'admin'], default: 'user'},
    
    'passwordConfirm':{type:String, require:[true, 'please enter password'],  minlength: 8,
        // This only works on  CREATE and SAVE!!! 
        validate:{validator: function(el){
            return el === this.password;    //abc ====xyz
        },  message : 'password not the same'
    }
    },
    'passwordChangedAt': Date,
    'passwordResetToken' : String,
    'passwordResetExpires':Date,
    'active': {type:Boolean, dafault: true, select: false}
    

 
})

// // this ensure paswword changed att property is always behing jwt timestamp
// Userschema.pre('save', function(next){
//     if (!this.isModified('password') || this.isNew ) return next();

//     this.passwordChangedAt = Date.now() - 1000;
//     next()

// })

Userschema.pre(/^find/, function(next){
  // this points to the current query
  this.find({active: {$ne:false}});
  next()
})




// // Doocument middleware for password hashing ; this only runs this function if password was actually modfied 
// Userschema.pre('save', async function(next){
//     if(!this.isModified('password')) return next();
// // has the pasword with cost of 12 a
//     this.password = await bcrypt.hash(this.password, 12);

//     //  delete the passwrod confirm field
//     this.passwordConfirm = undefined;
//     next() 
    



// })



Userschema.methods.correctPassword =async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}



// Userschema.methods.changedPasswordAfter = function(JWTTimestamp){
//     if (this.passwordChangedAt){
//         const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
        
//         return JWTTimestamp < changedTimestamp;
//     }

//     // false means not changed  and not changed means that the day or time at t=which the token was issued is less than the changed timstamp
//     return false; 
// }

Userschema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


// Userschema.methods.createPasswordResetToken = function(){
//     const resetToken = crypto.randomBytes(32).toString('hex')
    
//     this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
//     console.log({resetToken}, this.passwordResetToken);
//     this.passwordResetExpires = Date.now()+10*60*1000;


//     return resetToken
// }


Userschema.methods.createPasswordResetToken = function() {
    

  const resetToken = crypto.randomBytes(32).toString('hex');


//   This encrypts the rest token in the database where this represents Useschema
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  console.log({resetToken} , this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const User = mongoose.model('User', Userschema)

module.exports = User



