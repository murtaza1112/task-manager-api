const express = require('express')
const User = require('../models/user')
const router = new express.Router()
//refactoring code to get different files for each model

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    //only one res.send() is allowed
     //async await call
      try{
          await user.save()
          res.status(201).send(user)
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
  
router.get('/users',async (req,res)=>{
     
      try{
          const users = await User.find({})
          res.status(201).send(users)
      }catch(e){
          res.status(400).send(e)
      }
      // User.find({})
      // .then((users)=>{
      //     res.send(users)
      // }).catch((error)=>{
      //      res.send(error)
      // })
      //obtain all documents,to see all CRUD mongoose operators go to docs in query section
  })
  
  //get operation to obtain a single user based on its id,to pass dynamic id ,express provides ':' followed by variable name to access the vaiable name in get body
router.get('/users/:id',async (req,res)=>{
      
      const _id = req.params.id//access the params method which returns the params object containing fields matched
      try
      {
          const user =  await User.findById(_id)//autotically converts string ids to object ids mongooes does for us 
          if(user)
          {return res.send(user)}
  
          console.log(user)
          res.send("sorry couldnt find the object")
      }catch(error){
           res.status(404).send(error)
      }
      //obtain all documents,to see all CRUD mongoose operators go to docs in query section
  })
  
router.patch('/users/:id',async (req,res)=>{

    const updates  = Object.keys(req.body)//returns an array of object property string names
    const allowedUpdates = ['name','email','password','age']  
    const isValidOperation  = updates.every((update)=> allowedUpdates.includes(update))
    //will return true only of all elements return true in the callback

    if(!isValidOperation)
    {
        return res.status(400).send("error:field entered dosent exist")
    }

    try{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
      //get new returned data
      console.log(user)
      if(!user)
      {
          return res.status(404).send()
      }
      res.send(user)
    }catch(e)
    {
        res.status(400).send()
    }
  })

router.delete('/users/:id',async (req,res)=>{
    //returns deleted user
       try{ const user = await User.findByIdAndDelete(req.params.id)
        console.log(user)
        if(!user)
        {
            return res.status(400).send()
        }
    
        res.send(user)
    }catch(e)
    {
        console.log(e)
        res.status(500).send(e)
    } 
    })
    
  module.exports = router