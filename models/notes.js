const mongoose =require('mongoose');

const notesSchema =new mongoose.Schema(
    {    _id: false,
        id:Number,
        title:String,
        url:String
    }
)

module.exports=notesSchema;