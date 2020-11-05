
 const   router    =    require('express').Router();
 const   Members   =    require('../../models/members');

 router.get('/members',async(req,res)=>{
    try{

     let name = req.session.name;
     if(!name) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let user = await Members.findOne({name: name}).populate('sub');
     if(!user || !user.sub) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let isAuthed = user.sub.roles.includes('لوحه التحكم');
     if(!isAuthed) return res.status(400).send({msg:'ليس لديك صلاحيات', data:null , status:'400'});

     let data = await Members.find().populate('sub').select('-_id -__v -password ');

     let formed_data = data.map(i => {
        let object = {
            name: i.name,
            decoration: i.decoration,
            subscription: i.sub.name,
            reg_date: i.reg_date,
            last_device: i.last_device,
            last_ip: i.last_ip,
            last_login: i.last_login,      
        }
        return object;
     });

     let result = formed_data.filter((i)=>{
        if(i.name === 'master') return false;
        else return true;
     });

     return res.send({msg:'تم عرض الأعضاء بنجاح', data: result ,status:'200' });

    }catch(err){         
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});      
    }
   
          
 });

 module.exports  =  router;