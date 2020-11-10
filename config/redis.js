
 const  config  =   require('dotenv').config();
 const  redis   =   require('redis');

 const client   =   redis.createClient({
   port: process.env.REDIS_PORT,
   host: process.env.REDIS_HOST    
 });

 client.auth(process.env.REDIS_PASS, function(err, response){
   if(err){
     console.log(err.message);
   }
   console.log("redis connection status   :  "+response);      
 });

 module.exports = client ;