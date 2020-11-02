 const    router     =   require('express').Router();
 const    Members    =   require('../models/members');
 const Subscriptions =   require('../models/subscriptions'); 
 const   Status      =   require('../models/status');
 const    Logs       =   require('../models/logs');

 router.get('/get_status', async(req , res)=>{
   
  try{

      let name = req.session.name;
    
      let isUser = await Members.findOne({name: name});
      if(!isUser) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400' });
      
      let isAuthed = await Subscriptions.findOne({name: isUser.sub_name});
      let authed = isAuthed.roles.includes('لوحة التحكم');
      
      if(!authed) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400'});
          
      let data  =  await Status.find();
      
      return res.send({msg:'تمت العملية بنجاح', data: data, status:'200'});            

  }catch(err){
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما ', data: null, status:'500'});
  }
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // G E T   L O G S   T A B L E 

 router.get('/get_logs', async(req , res)=>{
   
    try{
  
        let name = req.session.name;
      
        let isUser = await Members.findOne({name: name});
        if(!isUser) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400' });
        
        let user_sub_data = await Subscriptions.findOne({name: isUser.sub_name});
        let authed = user_sub_data.roles.includes('لوحة التحكم');
        
        if(!authed) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400'});
            
        let data  =  await Logs.find();
        
        return res.send({msg:'تمت العملية بنجاح', data: data, status:'200'});            
  
    }catch(err){
        console.log(err.stack);
        return res.status(500).send({msg:'حدث خطأ ما ', data: null, status:'500'});
    }
    
   });

 module.exports = router;