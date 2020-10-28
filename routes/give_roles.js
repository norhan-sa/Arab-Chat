 const  router   =  require('express').Router();
 const  Members  =  require('../models/members');


 router.post('/give_role', async(req, res)=>{

  let {roles, member_name}  = req.body;     
  let name  = req.session.name; 
  if(!name) return res.status(400).send({msg:'ليس لديك صلاحية', data:null , status:'400'});

  try{
    let user = await Members.findOne({name: name}); 
    
    let have_role = user.roles.includes("role");
    if( !have_role ) return res.status(400).send({msg:'ليس لديك صلاحية لإعطاء عضوية', data:null , status:'400'});

    let is_user = await Members.findOne({name: member_name});
    if(!is_user) return res.status(400).send({msg: 'المستخدم المطلوب لا يملك عضوية' , data:null , status:'400'});

    let new_roles  =  is_user.roles.concat(roles);
    let result = new_roles.filter((item,index)=>{
        return (new_roles.indexOf(item) == index)
    });
    
    let updated_member = await Members.update({name: member_name},{roles: result});

    return res.send({msg:'تم إعطاء الصلاحيات للمستخدم', data:null, status:'200'});

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        
  }

 }); 

 module.exports  =  router;