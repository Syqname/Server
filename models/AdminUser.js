const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  
    username:{type:String},
    password:{type:String,
        select:false,
        //密码默认查不出
        set(val){
        return require('bcryptjs').hashSync(val,10)
        //散列密码，相当于加密
    }
},
       

    
})
module.exports = mongoose.model('AdminUser',schema)