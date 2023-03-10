const express =require("express")
const app= express()

app.set('secret','wfefrgerwdqffeg')
app.use(require('cors')())
app.use(express.json())

app.use('/uploads',express.static(__dirname+'/uploads'))
//  通过/uploads访问

require("./routes/admin")(app)
require("./plugins/db")(app)
require('./routes/web')(app)

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})
