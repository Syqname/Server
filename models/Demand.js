const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    icon:{type:String},
    name:{type:String},   
    jiage:{type:String},
    time:{type:String},
    number:{type:String},
    zili:{type:String},
    zhengming:{type:String},
    lianxi:{type:String}, 
    state:{type:Boolean}, 
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "WebUser" },
},{
    timestamps:true
})
module.exports = mongoose.model('Demand',schema)