const express = require('express')
const User = require('../models/user')
const router = new express.Router();
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeMail,sendCancelMail} = require('../emails/account')
//refactoring code to get different files for each model


router.post('/users/login',async (req,res)=>{
    try{
     const user = await User.findByCredentials(req.body.email,req.body.password)
     const token = await user.generateAuthToken();
     //should be an instance of the user and not the schema

     res.status(200).send({user,token})
    }catch(e){

    }
})

const upload = multer({
    //dest:'avatars',//cant actually store these images on a directory as during deployment the entire repo will be pushed to a server like aws ,thereby erasing details

    limits:{
        fileSize:1000000//1 million bytes
    },
    fileFilter(req,file,cb){
      //ways to call the callback(cb) function.
      //cb(new Error('File must be a PDF'))
      //cb(undefined,true)
      //cb(undefined,false)
      // for pdf
    //    if(!file.originalname.endsWith('.pdf'))
    //     {
    //         return cb(new Error("Please upload a pdf."))
    //     }
    ///\.(doc|docx)$/-regular expression
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error("Please upload an image."))
        }
        cb(undefined,true)

    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    //argument in upload.single function should match 
    //with key-value pair in the url header.
    //only accessible when no dests in the upload obj
    
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    //converts image to png and resizes to given dimensions then convert to buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send();
}, (error,req,res,next)=>{
    //adding there four args specifies uncaught errors in the file
    res.status(200).send({ error: error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
 
    req.user.avatar = undefined
    await req.user.save()
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
     //content type default is to application/json 
     //but since we want jpg image 
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
        //image easily accessible through src tag or web address
    } catch (e) {
        res.status(404).send()
    }
})

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    //only one res.send() is allowed
     //async await call
      try{
          await user.save()
          const token = user.generateAuthToken()
        console.log(token);
        sendWelcomeMail(user.email,user.name)
          res.status(201).send({user,token});
      }catch(e){
          res.status(400).send(e)
      }
  
  //same as above but use async await as more important
  
  //    user.save().then(()=>{
  //        res.status(201).send(user)//status code for objecf creation
  //    }).catch((error)=>{
  //        res.status(400).send(error)//set status code to 400
  //    })
  })
  //even if this route runs it dosent hold any signnificance as other users shouldnt be able to view data of other users ,therefore the route can be used to view your own profile
      
    router.get('/users/me',auth,async (req,res)=>{
     
    //   try{
    //       const users = await User.find({})
    //       res.status(201).send(users)
    //   }catch(e){
    //       res.status(400).send(e)
    //   }
    user=req.user;
    console.log("The user profile is sent:",req.user);
    res.send(user);
    
      // User.find({})
      // .then((users)=>{
      //     res.send(users)
      // }).catch((error)=>{
      //      res.send(error)
      // })
      //obtain all documents,to see all CRUD mongoose operators go to docs in query section
  })
  
  //get operation to obtain a single user based on its id,to pass dynamic id ,express provides ':' followed by variable name to access the vaiable name in get body
// router.get('/users/:id',async (req,res)=>{
      
//       const _id = req.params.id//access the params method which returns the params object containing fields matched
//       try
//       {
//           const user =  await User.findById(_id)//autotically converts string ids to object ids mongooes does for us 
//           if(user)
//           {return res.send(user)}
  
//           console.log(user)
//           res.send("sorry couldnt find the object")
//       }catch(error){
//            res.status(404).send(error)
//       }
//       //obtain all documents,to see all CRUD mongoose operators go to docs in query section
//   })
  
router.patch('/users/me', auth ,async (req,res)=>{

    const updates  = Object.keys(req.body)//returns an array of object property string names
    const allowedUpdates = ['name','email','password','age']  
    const isValidOperation  = updates.every((update)=> allowedUpdates.includes(update))
    //will return true only of all elements return true in the callback

    if(!isValidOperation)
    {
        return res.status(400).send("error:field entered dosent exist")
    }

    try{

        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
        //bypasses express middleware so cant has the password ,use a more o;d approach
    // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
      //get new returned data
      console.log(req.user)
      res.send(req.user)
    }catch(e)
    {
        res.status(400).send()
    }
  })

router.delete('/users/me',auth,async (req,res)=>{
    //returns deleted user
       try{ 
        //    const user = await User.findByIdAndDelete(req.user._id)
        // console.log(user)
        // if(!user)
        // {
        //     return res.status(400).send()
        // }
        await req.user.remove();
        sendCancelMail(req.user.email,req.user.email)
        res.send(req.user)
    }catch(e)
    {
        console.log(e)
        res.status(500).send(e)
    } 
    })
    
 router.post('/users/logout',auth,async(req,res)=>{
     try{
       //remove all tokens , logout from one session
       
       req.user.tokens = req.user.tokens.filter((token)=>{
           return token.token !== req.token
       })
       console.log("Array is updates yet not saved.")
       await req.user.save();
       res.send(200);
     }catch(e)
     {
         res.status(500);
     }
 })

 router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
      //remove one token , logout from one session
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send();
    }catch(e)
    {
        res.status(500);
    }
})
  module.exports = router