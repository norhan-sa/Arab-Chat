const router = require("./authentication");

const route = require('express').Router();

route.post('/test',(req,res)=>{
  req.session.name = req.body.name;
  return res.send('saved');
});

const DeviceDetector =   require('node-device-detector');
const   detector     =   new DeviceDetector;

route.get('/test1',(req,res)=>{
  let userAgent = req.headers['user-agent'];  
  console.log(userAgent);
  let result = detector.detect(userAgent);   
  let user_data = ''+result.os.name+' - '+result.client.type+' - '+result.client.name;

  return res.send(user_data);
});

module.exports = route;