 
 const  router     =   require('express').Router();
 const  Members    =   require('../models/members');
 const request_ip  =   require('request-ip');
 const   ipapi     =   require('ipapi.co');
 const  bcrypt     =   require('bcrypt');
 const DeviceDetector = require('node-device-detector');
 const detector = new DeviceDetector;

 // R E G E S T R A T I O N

 router.post('/reg', async(req, res)=>{
   
  try{

   let {name , password} = req.body;
  
   if(!name || !password) return res.status(400).send({msg:"الرجاء التحقق من البيانات المدخلة" ,data:null ,status:'400'});

   let isMember = await Members.findOne({name: name});
   if( isMember ) return res.status(400).send({msg:"هذا الاسم مسجل من قبل", data:null, satus:"400"});

   let salt = await bcrypt.genSalt(10);
   let hashedPass = await bcrypt.hash(password,salt);

   let member = new Members({name: name , password: hashedPass});
   member.save();

   let data = await getUserData(req);
   data.name = name;

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

     let data = await getUserData(req);
     data.name = name;

     return res.send({msg:'تم تسجيل الدخول بنجاح', data:data ,status:200});
     
   }catch(err){

     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data:null , status:'500'});        

   }
 });
   //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
   
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


   async function getUserData(req){

     let userAgent = req.headers['user-agent'];  
     let result = detector.detect(userAgent);   
     let user_data = ''+result.os.name+' - '+result.client.type+' - '+result.client.name;

     let ip = request_ip.getClientIp(req)+"" ;
     let promise = new Promise(  resolve=>{ ipapi.location((res) => resolve(res) , ip);}  );
     let location = await promise;
   
     if( location.hasOwnProperty("country_name")) location = location.country_name+" "+location.city;
     else location = "unknown";

     return {
       device_type: user_data,
       location: location
     };
    
   }

 module.exports = router;