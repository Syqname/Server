

module.exports = (app) => {
   const express = require("express");
   const jwt = require("jsonwebtoken");
   const assert = require("http-assert");
   const AdminUser = require("../../models/AdminUser");
  
   const router = express.Router({
     mergeParams: true,
   });




   //创建资源
   router.post("/", async (req, res) => {
     const model = await req.Model.create(req.body);
     res.send(model);
   });
   //更新资源
   router.put("/:id", async (req, res) => {
     const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
     res.send(model);
   });
   //删除资源
   router.delete("/:id", async (req, res) => {
     await req.Model.findByIdAndDelete(req.params.id, req.body);
     res.send({
       success: true,
     });
   });
   //资源列表
   router.get(
     "/",
     //中间件拦截器
     async (req, res) => {
       const queryOptions = {};
       if (req.Model.modelName === "Category") {
         queryOptions.populate = "parent";
       }
       const items = await req.Model.find().setOptions(queryOptions).limit(100);
       res.send(items);
     }
   );
 
   //资源详情
   router.get("/:id", async (req, res) => {
     const model = await req.Model.findById(req.params.id);
     res.send(model);
   });
   //登录校验中间件
   const authMiddleware = require("../../middleware/auth"); //或者在这里直接写()也行，就不用每个都写()了
   //通过地址中的resource获取模型名
   const resourceMiddleware = require("../../middleware/resource");
 
   app.use(
     "/admin/api/rest/:resource",
     authMiddleware(),
     resourceMiddleware(),
     router
   );



   const multer = require("multer");
   const upload = multer({ dest: __dirname + "/../../uploads" });
   app.post(
     "/admin/api/upload",
     upload.single("file"),
     async (req, res) => {
       const file = req.file;
       file.url = `http://localhost:3000/uploads/${file.filename}`;
       res.send(file);
     }
   );
 
   app.post("/admin/api/login", async (req, res) => {
     const { username, password } = req.body;
     //1.根据用户名找用户
     const user = await AdminUser.findOne({ username }).select("+password");
     //假如键值对两个名字一样是可以简写的完整写法是username:username
     //.select('+password‘)中的+号意为强制取password，因为当时定义的时候select为false无法选取
     assert(user, 422, "用户不存在"); //这里是引用了assert插件
     // if (!user) {    --   这是原生写法， 用户不存在就抛出422状态码，并添加用户不存在
     //   return res.status(422).send({
     //     message: "用户不存在",
     //   });
     // }
     //2.校验密码
     const isValid = require("bcryptjs").compareSync(password, user.password);
     assert(isValid, 422, "密码错误");
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
   //错误处理函数,这里是让我们可以自己决定怎么处理异常，即这里的用statusCode或者500响应
   app.use(async (err, req, res, next) => {
     // console.log(err)
     res.status(err.statusCode || 500).send({
       message: err.message,
     });
   });
 };
 