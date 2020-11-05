 const   router    =   require('express').Router();
 const  Members    =   require('../../models/members');
 const  Shortcuts  =   require('../../models/shortcuts');


 // A D D   N E W   S H O R T C U T *

 router.post('/add_shortcut', async (req, res)=>{

  try{
    let { word , decoration } = req.body;
    if(!word || !decoration) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});
 
    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let isAuthed = user.sub.roles.includes('الاختصارات');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let is_used_word = await Shortcuts.findOne({word: word});
    if(is_used_word) return res.status(400).send({msg:'هذه الكلمة مستخدمة بالفعل', data:null, status:'400'});
    
    let data = {word: word, decoration: decoration};
 
    let shortcut = new Shortcuts(data);
    let result = await shortcut.save();

    let status = new Status({name: 'اضافة اختصار', first_mem: user.decoration , second_mem: decoration , room: '' ,time: new Date()});
    status.save().catch(err=>console.log(err.stack));
 
    return res.send({msg:'تم اضافة الاختصار بنجاح', data: data , status: '200'});
    

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});
  }

 });


 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  G E T   T H E   S H O R T C U T S 

 router.get('/get_shortcuts', async (req, res)=>{

  try{

    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let isAuthed = user.sub.roles.includes('الاختصارات');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let data = await Shortcuts.find();
 
    return res.send({msg:'تم عرض الصلاحيات بنجاح', data: data , status: '200'});
    
  }catch(err){

    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});

  }

 });


 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  D E L E T E   S H O R T C U T 

 router.post('/delete_shortcut', async (req, res)=>{

  try{

    let { word } = req.body;
    if(!word) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});
 
    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let isAuthed = user.sub.roles.includes('الاختصارات');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let is_used_word = await Shortcuts.findOne({word: word});
    if(!is_used_word) return res.status(400).send({msg:'هذه الكلمة غير مستخدمة كاختصار', data:null, status:'400'});
     
    Shortcuts.findOneAndDelete({word: word}).catch((err)=>console.log(err.stack));

    let status = new Status({name: 'ازالة اختصار', first_mem: user.decoration , second_mem: is_used_word.decoration , room: '' ,time: new Date()});
    status.save().catch(err=>console.log(err.stack));

    return res.send({msg:'تم حذف الاختصار بنجاح', data: null , status: '200'});

  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});
  }

 });
 
 module.exports = router;