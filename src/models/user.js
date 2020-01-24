const mongoose = require('mongoose')
const validator = require('validator')

//here the object is converted to schema begindf the scenes

const userSchema = new mongoose.schema({
    name:{
           type: String
    },
    age:{
           type: Number

    },
    email: {
         type: String,
         required:true,
         trim:true,//remove white spaces
         validate(value){
              if(!validator.isEmail(value))
              {
                  throw new Error("Invalid Email")
              }
         }
    },
    password: {
         type: String,
         required:true,
         minlenght: 7,
         validate(value)
         {
             if(value.toLowerCase().includes('password'))
             {     
                   throw new Error("cannot include the word password")
             }
         }
    }
})


const User =mongoose.model('User',userSchema)


module.exports  = User