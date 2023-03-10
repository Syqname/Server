const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    icon:{type:String},
    name:{type:String},   
    jiage:{type:String},
    time:{type:String},
    number:{type:String},
    dizhi:{type:String},
    lianxi:{type:String}, 
    title:{type:String},
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "WebUser" },
},{
    timestamps:true
})
module.exports = mongoose.model('Botany',schema)