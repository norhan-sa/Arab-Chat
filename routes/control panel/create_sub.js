 const    router     =   require('express').Router();
 const    Members    =   require('../../models/members');
 const Subscriptions =   require('../../models/subscriptions');
 const   Status      =   require('../../models/status');
 const    Joi        =   require('joi');


 // C R E A T E   O R   U P D A T E   S U B S C R I P T I O N 

 router.post('/create_subscription', async(req, res)=>{

  try{

    const {error} = validate(req.body);
    if(error) return res.status(400).json({data:null,msg:error.details[0].message,status:"400"});

    let {roles, sub_name, value , max_kick , max_gifts , max_adv , max_constRooms}  = req.body; 

    let name  = req.session.name; 
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحية', data:null , status:'400'});  

    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let have_role = user.sub.roles.includes("تعديل الصلاحيات");
    if( !have_role ) return res.status(400).send({msg:'ليس لديك صلاحية لإنشاء صلاحيات', data:null , status:'400'});
    
    if(sub_name === 'chatmaster' && user.sub.name !== 'master') return res.status(400).send({msg:'هذا الحساب محمي لا يمكنك التعديل عليه', data:null , status:'400'});

    if(user.sub.value < value) return res.status(400).send({msg:'لا يمكنك رفع ترتيب المجموعه اعلى من ترتيب مجموعتك', data:null ,status:'400'});    
    
    let is_already_sub = await Subscriptions.findOne({name: sub_name});

    if(is_already_sub) {

      let result  = Subscriptions.updateOne({name: sub_name}, {
        name: sub_name,
        value: value,
        roles: roles,
        max_kick: max_kick,
        max_adv: max_adv,
        max_gifts: max_gifts,
        max_constRooms: max_constRooms
      }).catch((err)=>console.log(err.stack));

      let status = new Status({
        name: 'تعديل مجموعة',
        first_mem: user.decoration,
        second_mem: sub_name,
        room: null,
        time: new Date()
      });
      status.save().catch((err)=>console.log(err.stack));

    }else{

      let sub = new Subscriptions({
        name: sub_name,
        value: value,
        roles: roles,
        max_kick: max_kick,
        max_adv: max_adv,
        max_gifts: max_gifts,
        max_constRooms: max_constRooms
      }); 
      sub.save().catch((err)=>console.log(err.stack));

      let status = new Status({
        name: 'إضافة مجموعة جديدة',
        first_mem: user.decoration,
        second_mem: sub_name,
        room: null,
        time: new Date()
      });
      status.save().catch((err)=>console.log(err.stack));       
    }
      
    return res.send({msg:'تم إضافة الصلاحيات بنجاح', data:null , status:'200'});

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        
  }

 }); 


 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  D E L E T E   A   S U B S C R I P T I O N

 router.post('/delete_subscription', async(req, res)=>{

  try{
    let {sub_name}  = req.body; 
    if(!sub_name) return res.status(400).send({msg: 'الرجاء التحقق من ارسال بيانات', data:null , status:'400'}); 

    let name  = req.session.name; 
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحية', data:null , status:'400'});
  
    let user = await Members.findOne({name: name}).populate('sub');
    if(!(user && user.sub)) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let have_role = user.sub.roles.includes("تعديل الصلاحيات");
    if( !have_role ) return res.status(400).send({msg:'ليس لديك صلاحية لإنشاء صلاحيات', data:null , status:'400'});
    
    if(sub_name === 'chatmaster' && user.sub.name !== 'master') return res.status(400).send({msg:'هذا الحساب محمي لا يمكنك التعديل عليه', data:null , status:'400'});

    if(user.sub.value < value) return res.status(400).send({msg:'لا يمكنك رفع ترتيب المجموعه اعلى من ترتيب مجموعتك', data:null ,status:'400'});    
    
    let is_already_sub = await Subscriptions.findOne({name: sub_name});
    if(!is_already_sub) return res.status(400).send({msg:'المجموعة غير موجودة', data:null , status:'400'});

    let status = new Status({
      name: 'حذف مجموعة',
      first_mem: user.decoration,
      second_mem: sub_name,
      room: null,
      time: new Date()
    });

    status.save().catch((err)=>console.log(err.stack));

    Subscriptions.findOneAndDelete({name: sub_name}).catch(err=>console.log(err.stack));

    return res.send({msg:'تم حذف المجموعة بنجاح', data:null , status:'200'});

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        
  }

 });

 
 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //   G E T   S U B S C R I P T I O N   D A T A

 router.get('/get_subscriptions', async(req,res)=>{

  try{

    let name  = req.session.name; 
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحية', data:null , status:'400'});
  
    let user = await Members.findOne({name: name}).populate('sub');
    if(!(user && user.sub)) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let have_role = user.sub.roles.includes("تعديل الصلاحيات");
    if( !have_role ) return res.status(400).send({msg:'ليس لديك صلاحية لإنشاء صلاحيات', data:null , status:'400'});
    
    let data = await Subscriptions.find();

    let result  =  data.filter((i)=>{
      if(i.name === 'master') return false;
      else return true;
    });

    return res.send({msg:'تم عرض الاشتراكات بنجاح', data: result , status:'200'});

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        
  }   

 });


 //  V A L I D A T E   R E Q U E S T   B O D Y 

 function validate(data){
          
  let schema={
    roles:Joi.array().required(),
    sub_name:Joi.string().required(),
    value:Joi.number().max(8999).required(),
    max_adv:Joi.string().min(13).max(1000).required(),
    max_constRooms:Joi.string().max(1000).required(),
    max_gifts: Joi.number().max(1000).required(),
    max_kick: Joi.number().max(1000).required()
  }
        
   return Joi.validate(data,schema);
        
  }

 module.exports  =  router;