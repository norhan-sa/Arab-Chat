
  const    router       =    require('express').Router();
  const    Members      =    require('../../models/members');
  const     auth        =    require('../../midleware/auth');

  router.post('/update_profile', auth ,async(req , res)=>{
   
   try{
    
    let {status, font_size , background_color , font_color , name_color } = req.body;
    
    let name = req.body.$name;
    if(!name) return res.status(400).send({msg:"لست مسجل" ,data:null ,status:'400'});

    let user = await Members.findOne({name: name});
    if(!user) return res.status(400).send({msg:"لست مسجل" ,data:null ,status:'400'});

    let result = {name: name};

    if(status){ user.status = status;  result.status = status}
    if(font_size){ user.font_size = font_size;  result.font_size = font_size;}
    if(background_color){ user.background_color = background_color;  result.background_color = background_color;}
    if(font_color){ user.font_color = font_color; result.font_color = font_color; }
    if(name_color){ user.name_color = name_color;  result.name_color = name_color;}

    user.save().catch(err=>console.log(err.stack));

    return res.send({msg:'تم تحديث ملف العضو بنجاح', data:result , status:'200'});

   }catch(err){
     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data: null, status:'500'});   
   } 

  });

  module.exports = router;