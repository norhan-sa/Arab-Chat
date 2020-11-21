 
 const    multer     =    require('multer');
 var      upload     =    multer({ dest: 'uploads/' }); 
 const    router     =    require('express').Router();
 const {upload_file , delete_file , upload_private_file} 
                     =    require('../../config/upload_files_to_firebase');
 const      fs       =    require('fs');
 const     auth      =    require('../../midleware/auth');
 const    client     =    require('../../config/redis');
 const    Members    =    require('../../models/members');
 const      nsp      =    require('../../server');


 //  U P L O A D   P R O F I L E   P I C T U R E

 router.post('/update-pic', upload.single('avatar') , auth , async(req,res)=>{

   try{

    let file  = req.file ; 

    let username ;

    if(req.body.$name) username = req.body.$name;

    let result = await upload_file(file.path , file.mimetype , username);
    if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

    if(req.body.$name){
       Members.findOneAndUpdate({name: req.body.$name},{pic:result}).catch(err=>console.log(err.stack));
    }
    
    res.send({msg: 'تمت اضافة الصورة بنجاح', data:{img_url: result}, status:'200'});

    deleteFolder(file.path);

    res.end();
    
   }catch(err){
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما', data: result, status:'500'}); 
   } 
 }); 

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  D E L E T E   P R O F I L E   P I C T U R E 

 router.post('/delete-pic' , auth , async(req,res)=>{

  try{ 

   let username ;

   if(req.body.$name) username = req.body.$name;
   else username = req.body.$visitor;

   let result = await delete_file(username);
   if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

   if(req.body.$name){
      Members.findOneAndUpdate({name: req.body.$name},{pic:null}).catch(err=>console.log(err.stack));
   }
   
   return res.send({msg:'تم حذف الصورة بنجاح', data:null, status:'200'});

  }catch(err){
     console.log(err.stack);
     return res.status(500).send({msg:'حدث خطأ ما', data: result, status:'500'}); 
  }                  
 });

 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //    S E N D   I M A G E   A S   P R I V A T E   M E S S A G E

 let test = 1 ;

 router.post('/private_image', upload.single('avatar') , auth , async(req,res)=>{

   try{

   let {from , to , toID , fromID} = req.body;
   let file  = req.file ; 

   let username ;
   if(req.body.$name) username = req.body.$name;

   console.log(test);

   let result = await upload_private_file(file.path , file.mimetype , test+'');
   if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

   deleteFolder(file.path);

   ++test;
   
    nsp.to(fromID).emit('private_message',{file: result , from: from , with: to , status:'200'});
    nsp.to(toID).emit('private_message',{file: result , from: from , with: from , status:'200'});
 
   res.send({msg: 'تم ارسال الصورة بنجاح', data:null, status:'200'});

   deleteFolder(file.path);

   res.end();

   }catch(err){
      console.log(err.stack);
      return res.status(500).send({msg:'حدث خطأ ما', data: null, status:'500'}); 
   }       
 }); 


 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //    A D D   I M A G E   T O   T H E   W A L L


//  router.post('/wall_media', upload.single('avatar') , auth , async(req,res)=>{

//    try{

//    let username;
//    if(req.body.$name) username = req.body.$name;

//    console.log(test);

//    let result = await upload_private_file(file.path , file.mimetype , test+'');
//    if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

//    deleteFolder(file.path);

//    ++test;
   
//     nsp.to(fromID).emit('private_message',{file: result , from: from , with: to , status:'200'});
//     nsp.to(toID).emit('private_message',{file: result , from: from , with: from , status:'200'});
 
//    res.send({msg: 'تم ارسال الصورة بنجاح', data:null, status:'200'});

//    deleteFolder(file.path);

//    res.end();

//    }catch(err){
//       console.log(err.stack);
//       return res.status(500).send({msg:'حدث خطأ ما', data: null, status:'500'}); 
//    }       
//  });  


 //  D E L E T E   T H E   F O L D E R 

 function deleteFolder(file){

  let filePath = "./"+file ;    

  fs.unlink(filePath, (err) => {

     if (err) {
        console.log(err.message);
     } else  console.log(`${file} is deleted!`);

  });
 }

 module.exports = router;