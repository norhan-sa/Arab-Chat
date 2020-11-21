
 const   route    =    require('express').Router();
 const   Site     =    require('../../models/wesite');
 const   Members  =    require('../../models/members');
 const   auth     =    require('../../midleware/auth');
 const   Joi      =    require('joi');
 const  site_data =    require('../../server');

 route.post('/manage_site',auth, (req,res)=>{
  
  try{   
    
    let name = req.body.$name;      

    const {error} = validate(req.body);
    if(error) return res.status(400).json({data:null,msg:error.details[0].message,status:"400"});

    let user = Members.findOne({name: name}).populate('sub');

    if(!(user.sub.name === 'master' || user.sub.name === 'admin'))
    return res.status(400).json({msg:'فقط صاحب الموقع من يمكنه إجراء التعديلات', data:null, status:"400"});

    Site.findOneAndUpdate({id: 1},req.body).catch(err=>console.log(err.message));
    site_data = req.body;

    return res.send({data:null, msg:'تم حفظ التعديلات بنجاح', status:"200"});
    
  }catch(err){
     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'}); 
  }       

 });

 //  G E T   S I T E   D A T A 
 route.get('/site_data',auth, (req,res)=>{
  
  try{   
    
    let name = req.body.$name;      

    let user = Members.findOne({name: name}).populate('sub');

    if(! user.sub.roles.includes('إداره الموقع'))
    return res.status(400).json({msg:'ليس لديك صلاحيات', data:null, status:"400"});

    Site.findOneAndUpdate({id: 1},req.body).catch(err=>console.log(err.message));

    return res.send({data:null, msg:'تم حفظ التعديلات بنجاح', status:"200"});
    
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'}); 
  }       

 });



 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 function validate(data){
          
  let schema={
    name:Joi.array().required(),
    title:Joi.string().required(),
    description:Joi.string().required(),
    keywords:Joi.string().required(),
    script:Joi.string().required(),
    template_color: Joi.string().required(),
    content_color:Joi.string().required(),
    buttons_color: Joi.string().required(),
    daily_msg_time: Joi.number().required(),
    rooms_msgs_likes: Joi.number().required(),
    wall_likes: Joi.number().required(),
    wall_upload_likes: Joi.number().required(),
    wall_upload_time: Joi.number().required(),
    allow_visitors: Joi.boolean().required(),
    allow_reg: Joi.boolean().required(),
    update_data_likes: Joi.number().required(),
    update_pic_likes: Joi.number().required(),
    notification_likes: Joi.number().required(),
    private_pic_likes: Joi.number().required(),
    public_letters: Joi.number().required(),
    private_letters: Joi.number().required(),
    wall_letters: Joi.number().required(),
    visitor_name_letters: Joi.number().required(),
    reg_name_letters: Joi.number().required()
  }
   return Joi.validate(data,schema);     
 }

 module.exports = route;