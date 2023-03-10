const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    icon:{type:String},
    avatar:{type:String},
    name:{type:String},   
    username:{type:String},
    tele:{type:Number},
    auth:{type:Boolean},
    purchased:[{type:mongoose.SchemaTypes.ObjectId,ref:'Botany'}],
    password:{type:String,
        select:false,
        //密码默认查不出
        set(val){
        return require('bcryptjs').hashSync(val,10)
    }
},
       

    
})
module.exports = mongoose.model('WebUser',schema)