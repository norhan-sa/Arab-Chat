
 const    router       =    require('express').Router();
 const    Members      =    require('../../models/members');
 const Subscriptions   =    require('../../models/subscriptions');
 const     auth        =    require('../../midleware/auth');

 
 router.get('/members', auth ,async(req,res)=>{

    try{

     let name = req.body.$name;
     if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let user = await Members.findOne({name: name}).populate('sub');
     if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let isAuthed = user.sub.roles.includes('لوحه التحكم');
     if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let data = await Members.find().populate('sub').select('-_id -__v -password ');

     let formed_data = data.map(i => {
        let object = {
            name: i.name,
            decoration: i.decoration,
            subscription: i.sub.name,
            reg_date: i.reg_date,
            last_device: i.last_device,
            last_ip: i.last_ip,
            last_login: i.last_login,      
        }
        return object;
     });

     let result = formed_data.filter((i)=>{
        if(i.name === 'master') return false;
        else return true;
     });

     return res.send({msg:'تم عرض الأعضاء بنجاح', data: result ,status:'200' });

    }catch(err){         
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
    }
          
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  G I V E   S U B S C R I P T I O N   T O   A   U S E R

 router.post('/give_subscription' , auth , async(req,res)=>{

   try{

      let {user_name , sub_name , interval}  = req.body;
      if(!(user_name && sub_name && interval)) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

      let name = req.body.$name;
      if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let user = await Members.findOne({name: name}).populate('sub');
      if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let isAuthed = user.sub.roles.includes('إداره العضويات');
      if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let sub  =  await Subscriptions.findOne({name: sub_name});
      if(!sub) return res.status(400).send({msg:'هذاالاشتراك غير موجود', data:null , status:'400'});

      let expiration_date = null;

      if(interval !== 0 && typeof x === number){
         var someDate = new Date();
         let newDate = someDate.setDate(someDate.getDate() + interval);
         expiration_date = new Date(newDate); 
      } 

      let updated_user = await Members.findOneAndUpdate({name: user_name},{sub: sub._id , expire_date: expiration_date});
      if(updated_user) return res.send({msg:'تم ترقية العضو بنجاح', data:null, status: '200'});

      return res.status(400).send({msg:'هذا العضو غير موجود', data:null , status:'400'});

     }catch(err){         
       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
     }

 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // S E T   T H E   N U M B E R   O F   L I K E S

 router.post('/set_user_likes' , auth , async(req,res)=>{

   try{

      let {user_name , likes_num}  = req.body;
      if(!(user_name && likes_num)) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

      let name = req.body.$name;
      if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let user = await Members.findOne({name: name}).populate('sub');
      if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let isAuthed = user.sub.roles.includes('إداره العضويات');
      if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let updated_user = await Members.findOneAndUpdate({name: user_name},{likes: likes_num});
      if(updated_user) return res.send({msg:'تم تعديل عدد اللايكات بنجاح', data:null, status: '200'});

      return res.status(400).send({msg:'هذا العضو غير موجود', data:null , status:'400'});

     }catch(err){         
       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
     }

 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //   S E T   U S E R   P A S S W O R D 

 router.post('/set_user_pass' , auth , async(req,res)=>{

   try{

      let {user_name , new_pass}  = req.body;
      if(!(user_name && new_pass)) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

      let name = req.body.$name;
      if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let user = await Members.findOne({name: name}).populate('sub');
      if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let isAuthed = user.sub.roles.includes('إداره العضويات');
      if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let updated_user = await Members.findOneAndUpdate({name: user_name},{password: new_pass});
      if(updated_user) return res.send({msg:'تم تعديل كلمة المرور بنجاح', data:null, status: '200'});

      return res.status(400).send({msg:'هذا العضو غير موجود', data:null , status:'400'});

     }catch(err){         
       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
     }

 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  S E T   U S E R   R e l i a b i l i t y   a n d    p r e m i u m   e n t r y

 router.post('/set_user_privileges' , auth , async(req,res)=>{

   try{

      let {user_name , is_certified , is_special}  = req.body;
      if(!(user_name && is_certified && is_special)) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

      let name = req.body.$name;
      if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let user = await Members.findOne({name: name}).populate('sub');
      if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      let isAuthed = user.sub.roles.includes('إداره العضويات');
      if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
      if(!(typeof is_certified == 'boolean' && typeof is_special == 'boolean'))
      return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

      let updated_user = await Members.findOneAndUpdate({name: user_name},{is_certified: is_certified , is_special: is_special});
      if(updated_user) return res.send({msg:'تم اجراء التعديلات بنجاح', data:null, status: '200'});

      return res.status(400).send({msg:'هذا العضو غير موجود', data:null , status:'400'});

     }catch(err){         
       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
     }

 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  D E L E T E   M E M B E R S H I P 

 router.post('/delete_member' , auth , async(req,res)=>{

  try{

     let {user_name}  = req.body;
     if(!user_name) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

     let name = req.body.$name;
     if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let user = await Members.findOne({name: name}).populate('sub');
     if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let isAuthed = user.sub.roles.includes('إداره العضويات');
     if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let is_user = await Members.findOne({name: user_name}).populate('sub');
     if(!is_user) return res.status(400).send({msg:'هذا العضو غير موجود', data:null , status:'400'});
     
     if(is_user.sub.value > user.sub.value)
     return res.status(400).send({msg:'لا يمكنك حذف عضو في ترتيب أعلا منك', data:null, status: '400'});
     
     Members.findOneAndDelete({name: user_name}).catch(err=>console.log(err.stack));
     
     return res.send({msg:'تم حذف العضو بنجاح', data:null, status: '200'});

    }catch(err){         
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
    }

});


 module.exports  =  router;