 const   router   =   require('express').Router();
 const  Members  =   require('../../models/members');
 const   Status   =   require('../../models/status');
 const    Logs    =   require('../../models/logs');


 // G E T   L O G S   T A B L E

 router.get('/status' , async(req,res)=>{

  try{

    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let isAuthed = user.sub.roles.includes('لوحه التحكم');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let data = await Status.find();

    return res.send({msg:'تم عرض الحالات بنجاح', data:data ,status:'200' });

  }catch(err){         
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
  }

 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // G E T   L O G S   T A B L E

 router.get('/logs' , async(req,res)=>{

  try{

    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let isAuthed = user.sub.roles.includes('لوحه التحكم');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let data = await Logs.find();

    return res.send({msg:'تم عرض السجل بنجاح', data:data ,status:'200' });

  }catch(err){         
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
  }

 });

 module.exports = router;