const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/tasks',async (req,res)=>{
    const task= new Task(req.body)
    //only one res.send() is allowed
     try{
         task.save()
         res.send(user)
     }catch(error){
         res.status(400).send(error)//set status code to 400
     }
  })

router.get('/tasks',async (req,res)=>{
    //only one res.send() is allowed
    try{
        const tasks = await Task.find({})
        console.log(tasks)
        res.status(201).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
  })

router.get('/tasks/:id',(req,res)=>{
      const _id = req.params.id//access the params method which returns the params object containing fields matched
      const promise = Task.findById(_id)//autotically converts string ids to object ids mongooes does for us 
      promise.then((task)=>{
          console.log(task)
          
          if(task)
          return res.send(task)
  
          console.log("sorry couldnt find the object")
      }).catch((error)=>{
           res.status(404).send(error)
      })
  })


  //update operations


  router.patch('/tasks/:id',async(req,res)=>{
    const updates  = Object.keys(req.body)//returns an array of object property string names
    const allowedUpdates = ['description','completed']  
    const isValidOperation  = updates.every((update)=> allowedUpdates.includes(update))
    //will return true only of all elements return true in the callback

    if(!isValidOperation)
    {
        return res.status(400).send("error:field entered dosent exist")
    }

    try{
    const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
      //get new returned data
      console.log(task)
      if(!task)
      {
          return res.status(404).send()
      }
      res.send(task)
    }catch(e)
    {
        res.status(400).send()
    }
  })


router.delete('/tasks/:id',async (req,res)=>{
    try{ const task = await Task.findByIdAndDelete(req.params.id)
        console.log(task)
        if(!task)
        {
            return res.status(400).send()
        }
    
        res.send(task)
    }catch(e)
    {
        console.log(e)
        res.status(500).send(e)
    } 
})

module.exports = router