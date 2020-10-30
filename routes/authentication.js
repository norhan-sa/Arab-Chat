 const   router       =    require('express').Router();
 const   Members      =    require('../models/members');
 const    Logs        =    require('../models/logs');
 const  request_ip    =    require('request-ip');
 const    ipapi       =    require('ipapi.co');
 const    bcrypt      =    require('bcrypt');
 const DeviceDetector =    require('node-device-detector');
 const   detector     =    new DeviceDetector;

 let roles   =  [
   'rooms',
   'block',
   'mute',
   'room_kick',
   'chat_kick',
   'role'
 ];

 // R E G E S T R A T I O N

 router.post('/reg', async(req, res)=>{
   
  try{

   let {name , password} = req.body;
  
   if(!name || !password) return res.status(400).send({msg:"الرجاء التحقق من البيانات المدخلة" ,data:null ,status:'400'});

   let isMember = await Members.findOne({name: name});
   if( isMember ) return res.status(400).send({msg:"هذا الاسم مسجل من قبل", data:null, satus:"400"});

   let salt = await bcrypt.genSalt(10);
   let hashedPass = await bcrypt.hash(password,salt);

   req.session.name = name;

   let data = await getUserData(req);
   data.name = name;
   data.decoration = name;

   let member = new Members({name: name , decoration: name , password: hashedPass , last_ip: data.ip , last_device: data.device_type , last_login: new Date() , reg_date: new Date()});
   member.save().catch((err)=>console.log(err.stack));

   
   return res.send({msg:'تم التسجيل العضو بنجاح', data: data, status:'200'});

  }catch(err){

    console.log(err.stack);
    return res.status(500).send({msg: 'حدث خطأ ما', data:null , status:'500'});

  }
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 // L O G  I N

 router.post('/login', async(req,res)=>{
   
   let {name , password} = req.body;
   
   try{

     let user  =  await Members.findOne({name: name});
     if( !user ) return res.status(400).send({msg:'أنت مخطئ في اسم المستخدم', data:null , status:'400'});

     let result = await bcrypt.compare(password , user.password);

     if(!result) return res.status(400).send({msg:'أنت مخطئ في كلمة المرور' , data: null , status:'400'});

     req.session.name = user.name;

     let data = await getUserData(req);
     data.name = name;
     data.decoration = user.decoration;
     data.id = user.id;
     
     Members.updateOne({id: user.id},{ last_ip: data.ip , last_device: data.device_type , last_login: new Date() })
     .catch((err)=>console.log(err.stack));

     return res.send({msg:'تم تسجيل الدخول بنجاح', data:data ,status:200});
     
   }catch(err){

     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        

   }
 });

   //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
   
   // V I S I T O R

   router.post('/visitor', async(req,res)=>{

     try{

      let {name}  = req.body;    
      if( !name ) return res.satus(400).send({msg:'الرجاء التحقق من البيانات', data:null , status:'400'}); 
      
      let isMember = await Members.findOne({name: name});
      if( isMember ) return res.status(400).send({msg:'يرجى اختيار اسم آخر' , data:null , status:'400'});

      let data = await getUserData(req);
      data.name = name;

      return res.send({msg:'تم دخول الزائر بنجاح', data:data , status:'200'});

    }catch(err){

       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطا ما', data: null , status:'500'});   

    }

   });


   // G E T   U S E R   D A T A   F R O M   R E Q U E S T

   async function getUserData(req){

     let userAgent = req.headers['user-agent'];  
     console.log(userAgent);
     let result = detector.detect(userAgent);   
     let user_data = ''+result.os.name+' '+result.os.platform+' - '+result.client.type+' - '+result.client.name;

     let ip = request_ip.getClientIp(req)+"" ;
     let promise = new Promise(  resolve=>{ ipapi.location((res) => resolve(res) , ip);}  );
     let location = await promise;
     let country , city;
   
     if( location.hasOwnProperty("country_name")){
      country = location.country_name; 
      city = location.city;
     }else {
      country = "Unknown"; 
      city = "Unknown";       
     }
     console.log(location);
     return {
       device_type: user_data,
       country: location.country_name,
       city: location.city,
       ip: ip 
     };
    
   }

   function insertToLogs(type , data){
     let log  = new Logs({
       type: type,
       name: data.name,
       decoration: data.decoration,
       ip: data.ip,
       device_type: data.device_type,
       country: data.country,
       date: new Date(),
       source: null,
       invite: null,       
     });
     log.save().catch((err)=>console.log(err.stack));
   }

 module.exports = router;