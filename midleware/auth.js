
 const jwt = require('jsonwebtoken');
 const config = require('dotenv').config();

 async function auth(req,res,next){

 let jwtkey = process.env.JWT_KEY; 
 const token = req.header('x-auth-token');
 
 if(!token) return res.status(401).send({data:null,msg:"ليس لديك صلاحيات",status:"401"});

 try{

   const decoded = jwt.verify(token,jwtkey);

   req.body.$name = decoded.name;

   next();

 }catch(err){
   console.log(err.stack);
   return res.status(400).send({data:null,msg:"Invalid Token !",status:"400"});
 }

 }

 module.exports = auth;