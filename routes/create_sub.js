 const    router     =   require('express').Router();
 const    Members    =   require('../models/members');
 const Subscriptions =   require('../models/subscriptions');
 const   Status      =   require('../models/status');


 // C R E A T E   O R   U P D A T E   S U B S C R I P T I O N 

 router.post('/create_subscription', async(req, res)=>{

  let {roles, sub_name, value , max_kick , max_gifts , max_adv , max_constRooms}  = req.body; 

  let name  = req.session.name; 
  if(!name) return res.status(400).send({msg:'ليس لديك صلاحية', data:null , status:'400'});

  try{

    let user = await Members.findOne({name: name}).populate('sub');

    let have_role = user.sub.roles.includes("الصلاحيات");
    if( !have_role ) return res.status(400).send({msg:'ليس لديك صلاحية لإنشاء صلاحيات', data:null , status:'400'});
    
    if(user.sub.name === 'chatmaster') return res.status(400).send({msg:'هذا الحساب محمي لا يمكنك التعديل عليه', data:null , status:'400'});

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











 module.exports  =  router;