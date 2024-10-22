
 const   router    =    require('express').Router();
 const   Blocks    =    require('../../models/blockList');
 const   Members   =    require('../../models/members');
 const   Status    =    require('../../models/status');
 const    auth     =    require('../../midleware/auth');

 
 router.post('/blocks', auth ,async(req,res)=>{
  
  try{

    let {browsers , os , ip , device_id , country_code } = req.body;

    let name = req.body.$name;

    let isUser = await Members.findOne({name: name}).populate('sub');
    if(!isUser || !isUser.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400' });

    let authed = isUser.sub.roles.includes('لوحه التحكم');
    if(!authed) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400'});

    if(browsers){

       Blocks.findOneAndUpdate({browsers: { $ne: null }} ,{browsers: browsers , date: new Date()}).catch((err)=>console.log(err.stack)); 

       let status  =  new Status({name: 'تعديل حظر' , first_mem: name, second_mem: 'تعديل حظر المتصفحات' , room: ' ', time: new Date()});
       status.save().catch(err=>console.log(err.stack));

       return res.send({msg:'تم حظر المتصفحات المطلوبة بنجاح', data: null, status: '200'});

    }

    if(os){

       Blocks.findOneAndUpdate({os: { $ne: null }} ,{os: os , date: new Date()}).catch((err)=>console.log(err.stack)); 
       
       let status  =  new Status({name: 'تعديل حظر' , first_mem: name, second_mem: 'تعديل حظر أنظمة التشغيل' , room: ' ', time: new Date()});
       status.save().catch(err=>console.log(err.stack));        
       
       return res.send({msg:'تم حظر أنظمة التشغيل المطلوبة بنجاح', data: null, status: '200'});

    }

    if(ip){

      let result = await Blocks.findOne({ip: ip});

      if(result) return res.status(400).send({msg: 'الأيبي محظور بالفعل', data:null , status:'400' });
      
      let block = new Blocks({ip: ip , date: new Date() , ends_in: 'دائم' }); 
      block.save().catch((err)=>console.log(err.stack));

      let status  =  new Status({name: 'اضافة حظر' , first_mem: name, second_mem: ip , room: ' ', time: new Date()});
      status.save().catch(err=>console.log(err.stack));           
     
      return res.send({msg:'تم حظر الايبي المطلوب بنجاح', data: {memeber:'*', ip: ip , ends_in: 'دائم'} , status:'200'});   


    }

    if(device_id){

      Blocks.findOne({device_id: device_id}).then((res)=> {

         if(res) return res.status(400).send({msg: 'الجهاز محظور بالفعل', data:null , status:'400' });
         
         let block = new Blocks({device_id: device_id, date: new Date(), ends_in: 'دائم' }); 
         block.save().catch((err)=>console.log(err.stack));
         
         let status  =  new Status({name: 'اضافة حظر' , first_mem: name, second_mem: device_id , room: ' ', time: new Date()});
         status.save().catch(err=>console.log(err.stack));

         return res.send({msg:'تم حظر الجهاز المطلوب بنجاح', data: {memeber:'*', device_id: device_id , ends_in: 'دائم'} , status:'200'});      
      
      }); 
      }

      if(country_code){

         Blocks.findOne({country_code: country_code}).then((res)=> {
   
            if(res) return res.status(400).send({msg: 'الدولة محظورة بالفعل', data:null , status:'400' });
            
            let block = new Blocks({country_code: country_code, date: new Date(), ends_in: 'دائم' }); 
            block.save().catch((err)=>console.log(err.stack));
            
            let status  =  new Status({name: 'حظر من الدردشة' , first_mem: name, second_mem: country_code , room: ' ', time: new Date()});
            status.save().catch(err=>console.log(err.stack));
   
            return res.send({msg:'تم حظر الدولة المطلوبة بنجاح', data: {memeber:'*', device_id: device_id , ends_in: 'دائم'} , status:'200'});      
         
      });
      }

    return res.status(400).send({msg: 'الرجاء التحقق من ارسال بيانات', data:null , status:'400'});
    
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطا ما', data: null , status:'500'});    
  }        

 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // D E L E T E   F R O M   B L O C K   L I S T 

 router.post('/blocks',async(req,res)=>{
  
   try{
 
     let { ip , device_id , country_code } = req.body;
 
     let name = req.body.$name;
 
     let isUser = await Members.findOne({name: name}).populate('sub');
     if(!(isUser && isUser.sub)) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400' });
 
     let authed = isUser.sub.roles.includes('لوحه التحكم');
     if(!authed) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400'});
  
     if(ip){
 
       Blocks.findOneAndDelete({ip: ip}).catch(err=>console.log(err.stack));
 
       let status  =  new Status({name: 'ازالة حظر' , first_mem: name, second_mem: ip , room: ' ', time: new Date()});
       status.save().catch(err=>console.log(err.stack));           
      
       return res.send({msg:'تم إلغاء حظر الايبي المطلوب بنجاح', data: {memeber:'*', ip: ip , ends_in: 'دائم'} , status:'200'});   

     }
 
     if(device_id){
 
       Blocks.findOne({device_id: device_id}).then((res)=> {
 
          if(res) return res.status(400).send({msg: 'الجهاز محظور بالفعل', data:null , status:'400' });
          
          let block = new Blocks({device_id: device_id, date: new Date(), ends_in: 'دائم' }); 
          block.save().catch((err)=>console.log(err.stack));
          
          let status  =  new Status({name: 'اضافة حظر' , first_mem: name, second_mem: device_id , room: ' ', time: new Date()});
          status.save().catch(err=>console.log(err.stack));
 
          return res.send({msg:'تم حظر الجهاز المطلوب بنجاح', data: {memeber:'*', device_id: device_id , ends_in: 'دائم'} , status:'200'});      
       
       }); 
       }
 
       if(country_code){
 
          Blocks.findOne({country_code: country_code}).then((res)=> {
    
             if(res) return res.status(400).send({msg: 'الدولة محظورة بالفعل', data:null , status:'400' });
             
             let block = new Blocks({country_code: country_code, date: new Date(), ends_in: 'دائم' }); 
             block.save().catch((err)=>console.log(err.stack));
             
             let status  =  new Status({name: 'اضافة حظر' , first_mem: name, second_mem: country_code , room: ' ', time: new Date()});
             status.save().catch(err=>console.log(err.stack));
    
             return res.send({msg:'تم حظر الدولة المطلوبة بنجاح', data: {memeber:'*', device_id: device_id , ends_in: 'دائم'} , status:'200'});      
          
       });
       }
 
     return res.status(400).send({msg: 'الرجاء التحقق من ارسال بيانات', data:null , status:'400'});
     
   }catch(err){
     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطا ما', data: null , status:'500'});    
   }        
 
  });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  B A N E D   U S E R S

 
 router.post('/baned', async(req,res)=>{

  try{        
   
   let { member_name } = req.body;

   let name = req.body.$name;

   let isUser = await Members.findOne({name: name}).populate('sub');
   if(!isUser || !isUser.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data: null, status: '400' });
   
   let authed = isUser.sub.roles.includes('الباند');
   if(!authed) return res.status(400).send({msg:'ليس لديك صلاحيات' , data:null , status:'400'}); 
   
   let blocked_user = await Members.findOne({name: member_name});

   let block1 = new Blocks({ip: blocked_user.last_ip , member_name: member_name , date: new Date()}); 
   block1.save().catch((err)=>console.log(err.stack));  
          
   let block2 = new Blocks({device_id: blocked_user.device_id , member_name: member_name , mamber_id: member_id , date: new Date()}); 
   block2.save().catch((err)=>console.log(err.stack));

   let status  =  new Status({name: 'حظر من الدردشة' , first_mem: name, second_mem: member_name , room: ' ', time: new Date()});
   status.save().catch(err=>console.log(err.stack));   
          
   return res.send({msg:'تم حظر العضو المطلوب بنجاح', data: null , status:'200'});   

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطا ما', data: null , status:'500'});     
  }

 });

 module.exports = router;