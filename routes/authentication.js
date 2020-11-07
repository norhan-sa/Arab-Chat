 const   router       =    require('express').Router();
 const   Members      =    require('../models/members');
 const    Logs        =    require('../models/logs');
 const   Blocks       =    require('../models/blockList');
 const  request_ip    =    require('request-ip');
 const    ipapi       =    require('ipapi.co');
 const    bcrypt      =    require('bcrypt');
 const DeviceDetector =    require('node-device-detector');
 const   detector     =    new DeviceDetector;

 // R E G E S T R A T I O N

 router.post('/reg', async(req, res)=>{
   
  try{

   let {name , password , device_id , token} = req.body;
   if(!(name && password && device_id && token)) return res.status(400).send({msg:"الرجاء التحقق من البيانات المدخلة" ,data:null ,status:'400'}); 

   let data = await getUserData(req);
   data.info.name = name;
   data.info.decoration = name;
   data.info.device_id = device_id;

   let is_blocked  = await Blocks.find({$or:[{ip: data.info.ip},{device_id: device_id},{country_code: data.info.code},{os: data.os},{browser: data.browser}]});
   if(is_blocked.length != 0) {
     insertToLogs('محظور يحاول التسجيل	', data); 
     return res.status(400).send({msg:'تم حظرك من الدردشة', data:null , status:'400'});
   }

   let isMember = await Members.findOne({$or: [{name: name},{decoration: name}]});
   if( isMember ) return res.status(400).send({msg:"هذا الاسم مسجل من قبل", data:null, satus:"400"});

   let salt = await bcrypt.genSalt(10);
   let hashedPass = await bcrypt.hash(password,salt);

   req.session.name = name;

   let member = new Members({name: name , decoration: name, password: hashedPass , last_ip: data.info.ip , last_device: data.info.device_type , device_id: device_id, last_login: new Date() , reg_date: new Date()});
   let save_user = await member.save()
   data.info.id =  save_user.id;

   insertToLogs('تسجيل عضوية', data.info);

   return res.send({msg:'تم تسجيل العضو بنجاح', data: data.info, status:'200'});

  }catch(err){

    console.log(err.stack);
    return res.status(500).send({msg: 'حدث خطأ ما', data:null , status:'500'});

  }
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ]

 // L O G  I N

 router.post('/login', async(req,res)=>{
   
   
   try{
     
     let {name , password , device_id , token} = req.body;
     if(!(name && password && device_id && token)) return res.status(400).send({msg:"الرجاء التحقق من البيانات المدخلة" ,data:null ,status:'400'});

     let user  =  await Members.findOne({name: name}).populate('sub');
     if( !user ) return res.status(400).send({msg:'أنت مخطئ في اسم المستخدم', data:null , status:'400'});

     let data = await getUserData(req);
     data.info.name = name;
     data.info.decoration = user.decoration;
     data.info.id = user.id;
     data.info.device_id = device_id

     let is_blocked  = await Blocks.find({$or:[{ip: data.info.ip},{device_id: device_id},{country_code: data.info.code},{os: data.os},{browser: data.browser}]});
     if(is_blocked.length != 0) {
       insertToLogs('عضو محظور', data); 
       return res.status(400).send({msg:'تم حظرك من الدردشة', data:null , status:'400'});
     }

     let result = await bcrypt.compare(password , user.password);
     if(!result) return res.status(400).send({msg:'أنت مخطئ في كلمة المرور' , data: null , status:'400'});

     req.session.name = user.name;

     let roles = null;
     if(user.sub) roles = user.sub.roles;
     data.info.roles = roles;
     data.info.device_id = device_id;

     Members.findOneAndUpdate({id: user.id},{ last_ip: data.info.ip , last_device: data.info.device_type , device_id: device_id, last_login: new Date() })
     .catch((err)=>console.log(err.stack));

     insertToLogs('دخول العضو', data.info);

     return res.send({msg:'تم تسجيل الدخول بنجاح', data:data.info ,status:200});
     
   }catch(err){

     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        

   }
 });

   //ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
   
   // V I S I T O R

   router.post('/visitor', async(req,res)=>{

     try{

      let {name , device_id , token} = req.body;
      if(!(name && device_id && token)) return res.status(400).send({msg:"الرجاء التحقق من البيانات المدخلة" ,data:null ,status:'400'});
   
      let isMember = await Members.findOne({$or: [{name: name},{decoration: name}]});
      if( isMember ) return res.status(400).send({msg:'هذا الإسم مسجل من قبل' , data:null , status:'400'});

      let data = await getUserData(req);
      data.info.name = name;

      let is_blocked  = await Blocks.find({$or:[{ip: data.info.ip},{device_id: device_id},{country_code: data.info.code},{os: data.os},{browser: data.browser}]});
      if(is_blocked.length != 0) {
       insertToLogs('زائر محظور', data.info); 
       return res.status(400).send({msg:'تم حظرك من الدردشة', data:null , status:'400'});
      }

      insertToLogs('دخول الزائر', data.info);

      return res.send({msg:'تم دخول الزائر بنجاح', data:data.info , status:'200'});

    }catch(err){

       console.log(err.stack);
       return res.status(500).send({msg:'حدث خطا ما', data: null , status:'500'});   

    }

   });

   // G E T   U S E R   D A T A   F R O M   R E Q U E S T

   async function getUserData(req){

     let userAgent = req.headers['user-agent'];  
     let result = detector.detect(userAgent);   
     let user_data = ''+result.os.name+' '+result.os.platform+' - '+result.client.type+' - '+result.client.name;

     let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
     let promise = new Promise(  resolve=>{ ipapi.location((res) => resolve(res) , ip);}  );
     let location = await promise;
     let country , city , code;
   
     if( location.hasOwnProperty("country_name")){
      country = location.country_name; 
      city = location.city;
      code = location.country_code
     }else {
      country = "Unknown"; 
      city = "Unknown";  
      code = "UnKnown";     
     }

     let data = {
       info: {
        device_type: user_data,
        location: country+" - "+city,
        code: code,
        ip: ip 
      },
      os: result.os.name,
      browser: result.client.name
     }
     return data ;   
   }

   // I N S E R T   T O   L O G S   T A B L E 

   function insertToLogs(type , data){
     let log  = new Logs({
       type: type,
       name: data.name,
       decoration: data.decoration,
       ip: data.ip,
       device_type: data.device_type,
       device_id: data.device_id,
       country: data.code,
       date: new Date(),
       source: null,
       invite: null,       
     });
     log.save().catch((err)=>console.log(err.stack));
   }

 module.exports = router;