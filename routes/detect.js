 const router = require('express').Router();
 const DeviceDetector = require('node-device-detector');
 const detector = new DeviceDetector;

 router.get('/detect', (req,res)=>{
   
    let userAgent = req.headers['user-agent'];  
    let result = detector.detect(userAgent);
    
       
    console.log(result);
    return res.send(result);
 });

 module.exports = router ;