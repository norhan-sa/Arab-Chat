 const  router    =   require('express').Router();
 const Sortcuts   =   require('../models/shortcuts');
 const Members    =   require('../models/members');

 router.post('/add_shortcut', async (req, res)=>{

   let name = req.session.name;
   if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

   let user = await Members.findOne({name: name}).populate('sub');
   if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

   let isAuthed = user.sub.roles.includes('الإختصارات');
   if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});


 });

 module.exports = router;