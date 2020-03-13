const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')

router.post('/tasks',auth,async (req,res)=>{
    //const task= new Task(req.body)
    //only one res.send() is allowed
   
    //after adding user-owner property
    const task=new Task({
        ...req.body,//take all prop of req.body,new es6 property
        owner: req.user._id
    })
    console.log("The task will be added.")
     try{
         task.save()
         res.send(task)
         console.log("The task has been added.")
     }catch(error){
         console.log("The task could not be added.")
         res.status(400).send(error)//set status code to 400
     }
  })

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc or asce
router.get('/tasks',auth,async (req,res)=>{
    //only one res.send() is allowed.
    //only send back tasks created by our user
    const match = {}
    const sort ={}
    if(req.query.completed)
    {
        match.completed = req.query.completed==='true'
    }
    console.log(req.query.sortBy)
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = (parts[1]==='desc'? -1 : 1) 
    }
    console.log(sort)
    try{
        //approach 1
        //const tasks = Task.find({owner:req.user._id})
        //approach 2
        console.log("The user is:",req.user.name);
        const user = req.user;
        await user.populate({
            path:'tasks',
            match,//variable match with the completed flag,//only pass tasks according to the completed flag,if nothing provided in the query string then display all
            options:{
              limit: parseInt(req.query.limit),//implementing pagination , limit the amount of results u see,specified in the query strings
              skip: parseInt(req.query.skip),//skip var ,displays the next values which are not displayed due to pagination]
              sort //1 is ascending and -1 is descending
            }  

        }).execPopulate();
        const tasks = user.tasks;
        res.status(201).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})


router.get('/tasks/:id',auth,async (req,res)=>{
      //find only tasks created by ur id
      const _id = req.params.id//access the params method which returns the params object containing fields matched
      //const promise = Task.findById(_id)//autotically converts string ids to object ids mongooes does for us 
      try{
          const task = await Task.findOne({_id,owner: req.user._id})
          console.log("1",task);
          if(!task){
              return res.status(404).send();
          }
          res.send(task);
      }catch(e){
          res.status(500).send(e);
      }
  })


  //update operations

   router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates  = Object.keys(req.body)//returns an array of object property string names
    const allowedUpdates = ['description','completed']  
    const isValidOperation  = updates.every((update)=> allowedUpdates.includes(update))
    //will return true only of all elements return true in the callback

    if(!isValidOperation)
    {
        return res.status(400).send("error:field entered dosent exist")
    }
    try{

        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()

    // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
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


router.delete('/tasks/:id',auth,async (req,res)=>{
    try{ 
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        console.log("The task will be deleted")
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