const mongoose= require('mongoose');
const dbURI= process.env.MONGO_URI ;
const {MongoClient} =require("mongodb");

const connectDB= async ()=>{

    try{
        const conn = await mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected Successfully"+ conn.connection.host);
    }catch(error){
        console.log(error)
    }
}
module.exports= connectDB;