const express = require('express')
require('./db/mongoose')
//mongoose connects to the database
const User  = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = 3003
//parse the incoming json 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log('The port is active on :',port)
})

