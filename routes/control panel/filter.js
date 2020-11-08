 const  router   =   require('express').Router();
 const  Filter   =   require('../../models/filter');
 const  Members  =   require('../../models/members');
 const  Status   =   require('../../models/status');
 const   auth    =   require('../../midleware/auth');

 //  A D D   A   W O R D   T O   T H E   F I L T E R

 router.post('/add_filteredword', auth , async(req,res)=>{
 
  try{

    let {word , type} = req.body;
    if(!word || !type) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

    let name = req.body.$name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
 
    let isAuthed = user.sub.roles.includes('الفلتر');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    if(!(type == 'ممنوعة' || type == 'مراقبة'))
    return res.status(400).send({msg:'الرجاء التحقق من النوع المطلوب', data:null , status:'400'});
    
    let is_used_word = await Filter.findOne({word: word , type: type});
    if(is_used_word) return res.status(400).send({msg:'هذه الكلمة في الفلتر بالفعل', data:null, status:'400'});

    let data = {word: word , type: type};

    let filter = new Filter(data);
    filter.save().catch(err=>console.log(err.stack));

    if(type === 'مراقبة'){
       let status = new Status({name: 'اضافة كلمة مراقبة إلى الفلتر', first_mem: user.decoration , second_mem: word , room: '' ,time: new Date()});
       status.save().catch(err=>console.log(err.stack));        
    }else{
       let status = new Status({name: 'اضافة كلمة ممنوعة إلى الفلتر', first_mem: user.decoration , second_mem: word , room: '' ,time: new Date()});
       status.save().catch(err=>console.log(err.stack));               
    }

    return  res.send({msg: 'تم اضافة الكلمة إلى الفلتر بنجاح', data: data , status: '200'});
    
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'}); 
  }

 });


 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  G E T   F I L T E R E D   W O R D S 


 router.get('/get_filteredwords', auth , async(req,res)=>{
 
  try{
 
     let name = req.body.$name;
     if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
     let user = await Members.findOne({name: name}).populate('sub');
     if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
     let isAuthed = user.sub.roles.includes('الفلتر');
     if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
        
     let data = await Filter.find();
 
     return  res.send({msg: 'تم عرض الكلامات المفلترة بنجاح', data: data , status: '200'});
            
   }catch(err){
     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'}); 
   }
        
 });


 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // D E L E T E   F I L T E R E D   W O R D S

 router.post('/delete_filteredword', auth , async(req,res)=>{

   try{

    let {word , type} = req.body;
    if(!word || !type) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});

    let name = req.body.$name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    let isAuthed = user.sub.roles.includes('الفلتر');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    if(!(type == 'ممنوعة' || type == 'مراقبة'))
     return res.status(400).send({msg:'الرجاء التحقق من النوع المطلوب', data:null , status:'400'});
          
    let is_used_word = await Filter.findOne({word: word , type: type});
    if(!is_used_word) return res.status(400).send({msg:'هذه الكلمة غير مستخدمة في الفلتر', data:null, status:'400'});

    let data = {word: word , type: type};

    let filter = Filter.findOneAndDelete(data).catch(err=>console.log(err.stack));

    let status = new Status({name: 'ازالة فلتر', first_mem: user.decoration , second_mem: word , room: '' ,time: new Date()});
    status.save().catch(err=>console.log(err.stack));

    return  res.send({msg: 'تم حذف الكلمة من الفلتر بنجاح', data: data , status: '200'});
          
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'}); 
  }

 });

 module.exports = router;