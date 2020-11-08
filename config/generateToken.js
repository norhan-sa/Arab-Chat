 
 const   jwt    =   require('jsonwebtoken');
 const confing  =   require('dotenv').config();

 let jwtkey = process.env.JWT_KEY;

 function generateAuthToken(obj){
   const token = jwt.sign(obj,jwtkey);
   return token ;
 }


 module.exports = generateAuthToken;
  
