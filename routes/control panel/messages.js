 const   router    =    require('express').Router();
 const   Members   =    require('../../models/members');
 const   Messages  =    require('../../models/messages');
 const   Status    =    require('../../models/status');

 //   D E L E T E   A   M E S S A G E 
 
 router.post('/add_message', async (req, res)=>{

   try{

    let { type , title , body } = req.body;
    if(!(type && title && body)) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});
         
    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let isAuthed = user.sub.roles.includes('لوحه التحكم');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

    if(!(type === 'ترحيب' || type === 'يومية')) return res.status(400).send({msg:'الرجاء التحقق من نوع الرسالة', data:null , status:'400'});
               
    let data = {type: type, title: title , body: body};
         
    let message = new Messages(data);
    let result = await message.save();

    if(type === 'يومية'){

       let status = new Status({name: 'إضافةرسالة يومية', first_mem: user.decoration , second_mem: title , room: '' ,time: new Date()});
       status.save().catch(err=>console.log(err.stack));  

    }else{

       let status = new Status({name: 'إضافةرسالة ترحيب', first_mem: user.decoration , second_mem: title , room: '' ,time: new Date()});
       status.save().catch(err=>console.log(err.stack));  

    }
     
    return res.send({msg:'تم اضافة الرسالة بنجاح', data: result , status: '200'});
        
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});
  }
        
 });

 //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //      D E L E T E   A   M E S S A G E
         
 router.post('/delete_message', async (req, res)=>{

   try{

    let {id} = req.body;
    if(!id) return res.status(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'});
         
    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let isAuthed = user.sub.roles.includes('لوحه التحكم');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
               
    let result = Messages.findByIdAndDelete({_id: id});

    let status = new Status({name: 'إزالة رساله دردشة', first_mem: user.decoration , second_mem: result.title , room: '' ,time: new Date()});
    status.save().catch(err=>console.log(err.stack)); 
     
    return res.send({msg:'تم حذف الرسالة بنجاح', data: null , status: '200'});
            
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});
  }
        
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //   G E T   M E S S A G E S   L I S T

 router.get('/get_messages', async (req, res)=>{

   try{
    
    let name = req.session.name;
    if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let user = await Members.findOne({name: name}).populate('sub');
    if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
         
    let isAuthed = user.sub.roles.includes('لوحه التحكم');
    if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});
               
    let result = await Messages.find();

    return res.send({msg:'تم عرض الرسائل بنجاح', data: result, status: '200'});
            
  }catch(err){
    console.log(err.stack);
    return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});
  }
        
 }); 

 module.exports  =  router;
