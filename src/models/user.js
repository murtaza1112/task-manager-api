const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Task = require('./task')
const jwt = require('jsonwebtoken')
//here the object is converted to schema begindf the scenes

const userSchema = new mongoose.Schema({
    name:{
           type: String
    },
    age:{
           type: Number

    },
    email: {
         type: String,
         unique: true,
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
         minlength: 7,
         validate(value)
         {
             if(value.toLowerCase().includes('password'))
             {     
                   throw new Error("cannot include the word password")
             }
         }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true//by default set to false
})
//not stored in the db only for mongoose to be able to figure out who is related to what
userSchema.virtual('tasks',{
  ref:'Tasks',
  localField:'_id',//user id where 
  foreignField:'owner'//name of the field on the other thing(Taask) that creates the relationship
 //now populate will get all tasks created by the user as well 
})

//instance methods
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
}
//res.send is stringifying the object behind the scenes , therefore add this method to limit the amount of data viewed by the user.
userSchema.methods.toJSON = function (){
    //dont make this function async
    const user = this
    const userObj = user.toObject();
   
    delete userObj.tokens;
    delete userObj.password;
    delete userObj.avatar;
    return userObj
}

//model methods
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login')
    }
    const check = bcrypt.compare(password,user.password)

    if(!check){
        throw new Error('Unable to login')
    }
    return user;

}
//add middleware to run just before the user is saved,
userSchema.pre('save',async function(next){
     user = this

     if(user.isModified('password')){
         user.password = await bcrypt.hash(user.password,8)
     }
    
     console.log("The middleware is called.")
    next()
})
//add middleware to delete tasks before deleting the user
userSchema.pre('remove',async function(next){
    //another way to delete all tasks is to do perform in the delete router itself
    //but this taken for all round understanding
    const user = this;
    await Task.deleteMany({owner: user._id})
    next();
})
const User =mongoose.model('User',userSchema)


module.exports  = User