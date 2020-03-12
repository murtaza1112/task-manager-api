const express = require('express')
require('./db/mongoose')
//mongoose connects to the database
const User  = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcryptjs  = require('bcryptjs')
const app = express()
const port = process.env.PORT || 3000
const multer  = require('multer')



//add middleware function
// app.use((req,res,next)=>{
//     res.status(501).send("Sorry the site is currently under ma")
// })

//parse the incoming json 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



// const test = async ()=> {
//      const pass = '1234'
//      const user = await bcryptjs.hash(pass,8)
//      //8 sets the right balance between rounds of encrytion
//      const userlog = await bcryptjs.compare('1234',user)
//      console.log(user)
//      console.log(userlog)

// }
// test()




app.listen(port,()=>{
    console.log('The port is active on :',port)
})


// const main = async ()=>{
//     //To get user of a task

//     const task = await Task.findById("5e69ffb3b30d76638eacc846");

//     //gets the id of the owner:
//     console.log(task.owner);
    
//    // TO get the entire user without using find by id on user is using :
//     //converts the id to the entire owner info,

//     await task.populate("owner").execPopulate();
//     console.log(task.owner);


//    //to get tasks created by user

//    // now get tasks from users but no direct property like owner in the user model
//    // therefore define a virtual prop in schema then popualate the virtual prop:
    
//     const user = await User.findById("5e69fee5fe2bbf6380da5808")
//     //populate the virtual field
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks)
// }
