 const Members  =  require('../models/messages');
 const  router  =  require('express').Router();
 const   auth   =  require('../midleware/auth');

 router.get('/logout' , auth , async(req,res)=>{
   
    let name = req.body.$name;
    if(!name) return res.status(400).send({msg:'الرجاء التاكد من التوكن', data:null , status:'400'});

    let member = await Members.findOne({name: name});

    if(member.type === 'زائر') Members.findOneAndDelete({name: name}).catch(err=>console.log(err.stack));

    return res.send({msg:'تمت عملية تسجيل الخروج بنجاح', data:null , status:'200'});

 });

 module.exports = router;