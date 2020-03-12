const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required: true,
        trim: true

    },
    completed:{
        type: Boolean,
       default:false,
        },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
        //stands for references,relationship between user and task
    }
    
},{
    timestamps:true//by default set to false
})


const Task =mongoose.model('Tasks',taskSchema)

module.exports = Task