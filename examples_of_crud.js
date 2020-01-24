//examples of crud


// //Crud

// const mongodb = require('mongodb')

// //initialize the client
// const mongoClient = mongodb.MongoClient

// //connection variable
// const connectionURl='mongodb://127.0.0.1:27017'
// //same as //localhost but use ip address 

// const databasename = 'task-manager'

// //connect node to mongo
// mongoClient.connect(connectionURl, {useNewUrlParser: true } ,(error,client)=>{
//     if(error)
//     {
//         return console.log('unable to connect')
//     }
//     console.log("Connected To server")
//     const db = client.db(databasename)//create database and assign name
//     db.collection('users').insertOne({
//         name: 'Mustafa',
//         age: 17
//     },(error,result)=>{
//         if(error)
//         {
//             return console.log("Sorry data couldn't be added to database.")
//         }

//         console.log(result.ops,result.insertedCount)//output the inputted
//     })

//     db.collection('users').insertMany([{
//         name: 'Mustafa',
//         age: 17
//     },{
//         name:'tasnim',
//         age: 17
//     }],(error,result)=>{
//         if(error)
//         {
//             return console.log("Sorry many data couldn't be added to database.")
//         }

//         console.log("many data added" , result.ops,result.insertedCount)//output the inputted
//     })

// })

//const mongodb = require('mongodb')
const { MongoClient,ObjectID } = require('mongodb')

const url='mongodb://127.0.0.1:27017'
const id= new ObjectID()
MongoClient.connect(url, { useUnifiedTopology: true },(error,client)=>{
    if(error)
    {return console.log("Sorry couldn't connect")}

    const db = client.db('task-manager')
    const ref = db.collection('tasks')

    // ref.insertMany([{
    //     //_id:id
    //     //Provide aunique id from node instead form mongodb
    //     description:"arvind",
    //     age: 20
    // },{
    //     description:"sagar",
    //     age: 17
    // }],(error1,result)=>{
    //     if(error1)
    //     {
    //         return console.log("Couldnt enter data")
    //     }
       
    //     console.log(result.ops,result.insertedCount)

    // })
    
    // //returns a promise
    // const returnpromise=ref.updateOne({
    //     _id:new ObjectID("5e1f13dcecaa8f7f77cfdf25")
    // },{
    //     //updateaoperators
    //     $set:{
    //        name: "Mike"
    //     }
    // })

    // returnpromise.then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
    
    // ref.insertMany([{
    //     description : "murtaza",
    //     age: "39"
    // },{
    //     description: "mustafa",
    //     age: "41"
    // }],(error,result)=>{
    //     if(error)
    //     return console.log(error)

    //     return console.log(result)
    // })


//find method returns a cursor which is a pointer to the database
    //  ref.findOne({ _id: new ObjectID("5e21d10d566dea9432509363")},(error,result)=>{
    //      if(error)
    //      return console.log(error)

    //      return console.log(result)

    //  })
//cursor returned and method applied chcek docs to see upstae driers : 
//https:mongodb.github.io/node-mongodb-native/2.0/api-docs/


    //  ref.find().each((error,result)=>{
    //      if(error)
    //      return console.log("error")
         
    //      if(result==null)
    //      return console.log(result)
    //      if(result.age<=20)
    //      return console.log(result)

    //  })
   
    
    // ref.updateMany({
    //     age: 56
    // },{
    //     $set: {age:26}
    // }).then((result)=>{
    //     console.log("result:",result)
    // }).catch((error)=>{
    //     console.log(error)
    // })


})
