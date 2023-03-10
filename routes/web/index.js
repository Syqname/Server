module.exports= app=>{
const router = require('express').Router()
const mongoose = require('mongoose')
const Notice = mongoose.model('Notice')
const Thing = mongoose.model('Thing')
const Warning = mongoose.model('Warning')
const Item = mongoose.model('Item')
const Botany = mongoose.model('Botany')
const Demand = mongoose.model('Demand')
const WebUser = mongoose.model('WebUser')
const jwt = require("jsonwebtoken");
const assert = require("http-assert");
//登录校验中间件
const authMiddleware = require("../../middleware/userAuth.js");
const authVipMiddleware = require("../../middleware/vipAuth.js");


// -------------------------------------------首页开始 ----------------------------------------------
//三农要闻 Notice
router.get('/notices/list',async(req,res)=>{
  const cats = await Notice.find().limit(10)
  res.send(cats)
})
//要闻详情
router.get('/details/:id',async(req,res)=>{
  const data =await Notice.findById(req.params.id)
  res.send(data)
})
//更多三农要闻
router.get('/notice/list/more',async(req,res)=>{
  const data =await Notice.find().limit(100)
  res.send(data)
})
//农业资讯 Thing
router.get('/things/list',async(req,res)=>{
  const cats = await Thing.find().limit(10)
  res.send(cats)
})
//更多农业资讯 Thing
router.get('/things/list/more',async(req,res)=>{
  const cats = await Thing.find().limit(100)
  res.send(cats)
})
//违规警告 warning
router.get('/warnings/list',async(req,res)=>{
    const cats = await Warning.find().limit(10)
    res.send(cats)
  })
//更多违规警告 warning
router.get('/warnings/list/more',async(req,res)=>{
    const cats = await Warning.find().limit(100)
    res.send(cats)
  })
//市价公示
router.get('/items/list',async(req,res)=>{
    const cats = await Item.find().limit(20)
    res.send(cats)
  })
  //更多市价公示 
router.get('/items/list/more',async(req,res)=>{
  const cats = await Item.find().limit(100)
  res.send(cats)
})

//资讯详情
router.get('/detaills/:id',async(req,res)=>{
  const data =await Thing.findById(req.params.id)
  res.send(data)
})
// -------------------------------------------首页结束--------------------------------------------------
// ----------------------------------------个人中心开始--------------------------------------------------

router.post('/peoples',async(req,res)=>{
  const model = await WebUser.create(req.body)
  res.send(model)
})
//上架商品编辑后重新保存
router.put('/peoples/:id',async(req,res)=>{
 const model = await WebUser.findByIdAndUpdate(req.params.id,req.body)
 res.send(model)
})
//上架商品列表
router.get('/peoples',async(req,res)=>{
 const model = await WebUser.find()
 res.send(model)
})
//上架商品列表编辑数据获取接口
router.get('/peoples/:id',async(req,res)=>{
 const model = await WebUser.findById(req.params.id)
 res.send(model)
})
//删除商品
router.delete("/peoples/:id", async (req, res) => {
  await WebUser.findByIdAndDelete(req.params.id, req.body);
  res.send({
    success: true,
   });
  });
//个人信息编辑
router.put("/people/edit/:id", authMiddleware(), async (req, res) => {
  /* const username = req.body.username;
  if (WebUser.findOne(username)) {
    return res.status(422).send({
      message: "用户已存在",
    });
  } else { */
    const data = await WebUser.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
  // }
});

//我的信息
router.get("/people", async (req, res) => {
  const token = String(req.headers.authorization || "")
    .split(" ")
    .pop();
  const { id } = jwt.verify(token, req.app.get("secret"));
  req.user = await WebUser.findById(id).populate({
    path: "purchased"
  })
  .lean();
;
  res.send(req.user);
});//修改当前用户密码
router.put(
  "/people/password/edit/:id",
  authMiddleware(),
  async (req, res) => {
    const data = await WebUser.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
  }
);


//用户注册
router.post('/web_users',async(req,res)=>{
  const model = await WebUser.create(req.body)
  res.send(model)
})

// ---------------------------------------------我的商品开始--------------------------------------------
//上架商品
router.post('/botanies',async(req,res)=>{
   const model = await Botany.create(req.body)
   res.send(model)
})
//上架商品编辑后重新保存
router.put('/botanies/:id',async(req,res)=>{
  const model = await Botany.findByIdAndUpdate(req.params.id,req.body)
  res.send(model)
})
//上架商品列表
router.get('/botanies',async(req,res)=>{
  const model = await Botany.find()
  res.send(model)
})
//上架商品列表编辑数据获取接口
router.get('/botanies/:id',async(req,res)=>{
  const model = await Botany.findById(req.params.id)
  res.send(model)
})
//删除商品
router.delete("/botanies/:id", async (req, res) => {
await Botany.findByIdAndDelete(req.params.id, req.body);
res.send({
  success: true,
 });
});
//商品详情
router.get('/mai/:id',async(req,res)=>{
  const data =await Botany.findById(req.params.id)
  res.send(data)
})
 //当前用户上架商品记录
 router.get("/people/botany", authMiddleware(), async (req, res) => {
  const token = String(req.headers.authorization || "")
    .split(" ")
    .pop();
  const { id } = jwt.verify(token, req.app.get("secret"));
  req.user = await WebUser.findById(id);
  const model = await Botany.find({ author: id }).limit();
  res.send(model);
});
//删除上架商品记录
router.delete("/people/botany/:id", authMiddleware(), async (req, res) => {
  const data = await Botany.findByIdAndDelete(req.params.id, req.body);
  res.send(data);
});

// ---------------------------------------------我的商品结束---------------------------------------------

// ---------------------------------------------我的求购开始---------------------------------------------
//上架求购
router.post('/demands',async(req,res)=>{
  const model = await Demand.create(req.body)
  res.send(model)
})
//上架商品编辑后重新保存
router.put('/demands/:id',async(req,res)=>{
 const model = await Demand.findByIdAndUpdate(req.params.id,req.body)
 res.send(model)
})
//上架求购列表
router.get('/demands',async(req,res)=>{
 const model = await Demand.find()
 res.send(model)
})
//上架求购列表编辑数据获取接口
router.get('/demands/:id',async(req,res)=>{
 const model = await Demand.findById(req.params.id)
 res.send(model)
})
//删除求购
router.delete("/demands/:id", async (req, res) => {
await Demand.findByIdAndDelete(req.params.id, req.body);
res.send({
 success: true,
});
});
//求购详情
router.get('/sale/:id',async(req,res)=>{
  const data =await Demand.findById(req.params.id)
  res.send(data)
})
//当前用户上架求购记录
router.get("/people/demand", authMiddleware(), async (req, res) => {
  const token = String(req.headers.authorization || "")
    .split(" ")
    .pop();
  const { id } = jwt.verify(token, req.app.get("secret"));
  req.user = await WebUser.findById(id);
  const model = await Demand.find({ author: id }).limit();
  res.send(model);
});
//删除上架求购记录
router.delete("/people/demand/:id", authMiddleware(), async (req, res) => {
  const data = await Demand.findByIdAndDelete(req.params.id, req.body);
  res.send(data);
});
// ---------------------------------------------我的求购结束---------------------------------------------
// ---------------------------------------------商城开始------------------------------------------------

router.get('/botany/list',async(req,res)=>{
  const cats = await Botany.find().limit(30)
  res.send(cats)
})
// ---------------------------------------------商城结束---------------------------------------------
// ---------------------------------------------求购开始---------------------------------------------

router.get('/demandes',async(req,res)=>{
  const cats = await Demand.find().limit(30)
  res.send(cats)
})
// ---------------------------------------------求购结束---------------------------------------------


const multer = require("multer");
const upload = multer({ dest: __dirname + "/../../uploads" });
app.post(
  "/web/api/upload",
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:3000/uploads/${file.filename}`;
    res.send(file);
  }
);


app.post("/web/api/login", async (req, res) => {
const { username,password} = req.body;
// 根据用户名找用户
const user = await WebUser.findOne({ username }).select("+password");
assert(user, 422, "用户不存在，请先注册");
// if(!user){
//   return res.status(422).send({
//     message:'用户不存在，请先注册'
//   })
// }
//校验密码
const isValid = require("bcryptjs").compareSync(password, user.password);
if(!isValid){
  return res.status(422).send({
    message:'密码错误'
  })
}
//3.返回token
     //3.1引用const jwt = require("jsonwebtoken");被放在开头了
     const token = jwt.sign({ id: user._id }, app.get("secret"));
     //第一个是要加密的，计算机语境中译为有效载重(关键信息)
     //第二个是我们定义的秘钥，jwt到时候会根据一定的算法去加密这个秘钥，客户端可以不需要秘钥就取出数据，
     //但如果要验证客户端是否篡改过数据，就需要用jwt.verify去校验，
     //所以秘钥就是哪怕客户端篡改了信息，那服务端也能识别出这个是无效的
     //secret被定义在了server/index.js里
     res.send({ token });

    
});
app.use(async (err, req, res, next) => {
  // console.log(err)
  res.status(err.statusCode || 500).send({
    message: err.message,
  });
});
app.use('/web/api',router)
} 

