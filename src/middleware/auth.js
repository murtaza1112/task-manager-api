const User = require('../models/user')
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next)=>{

    try{
      //take info from headers and check if proper token is added or not
        //console.log(req.header("Authorization"));
        const token = req.header("Authorization").replace('Bearer ','');
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       //console.log('1. ',token) 
       const user = await User.findOne({ _id :decoded._id , 'tokens.token': token})
       // console.log(user)
         console.log("user found");
       if(!user)
       {
         throw new Error;
       }
       
       //the code ran well and the user is authenticated
       req.token = token;
       req.user = user;
       next();
    }catch(e){
        res.status(401).send("Please authenticate.")
    }

}

module.exports = auth;