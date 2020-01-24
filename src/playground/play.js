require('../db/mongoose')
const Task = require('../models/task')
const id = '5e241bb5c759ef5aaf9f6d09'

Task.findByIdAndDelete(id).then((task)=>{
    console.log(task)
    if(!task)
    return console.log("no task available")
    
    
   return Task.find({completed:false})
}).then((tasks)=>{
    if(tasks)
    console.log(tasks)
}).catch((e)=>{
    console.log(e)
})