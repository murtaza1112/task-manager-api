const mongoose = require('mongoose')
const validator = require('validator')

const url=process.env.MONGODB_URL
console.log(process.env)
mongoose.connect(url,{
    useCreateIndex: true,//index created when object added in schema
    useNewUrlParser: true,
    useUnifiedTopology: true 
})


// const me = new user({
//       name: 'Andrew',
//       age:27,
//       email: 'andrew@gmail.com    ',
//       password: 'andrew1112'
// })

// const me1 = new user({
//     name: 'Murtaza',
//     age:18,
//     email: 'murtaza@gmail.com',
//     password: 'pa123'

// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

// me1.save().then(()=>{
//     console.log(me1)
// }).catch((error)=>{
//     console.log(error)
// })




// const tasks =mongoose.model('Tasks',{
//     description:{
//         type:String,
//         required: true

//     },
//     completed:{
//         type: Boolean,
//        default:false,
//         }
// })

// const fir= new tasks({description:"poem",completed:false})

// fir.save().then(()=>{
//     console.log(fir)
// }).catch((error)=>{
//     console.log(error)
// })

