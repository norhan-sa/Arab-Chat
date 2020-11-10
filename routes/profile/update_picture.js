 
 const    multer     =    require('multer');
 var      upload     =    multer({ dest: 'uploads/' }); 
 const    router     =    require('express').Router();
 const {upload_file , delete_file} 
                     =    require('../../config/upload_files_to_firebase');
 const      fs       =    require('fs');
 const     auth      =    require('../../midleware/auth');
 const    client     =    require('../../config/redis');
const    Members     =    require('../../models/members');


 //  U P L O A D   P R O F I L E   P I C T U R E

 router.post('/update-pic', upload.single('avatar') , auth , async(req,res)=>{

    let file  = req.file ; 

    let username ;

    if(req.body.$name) username = req.body.$name;
    else username = req.body.$visitor;

    let result = await upload_file(file.path , file.mimetype , username);
    if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

    if(req.body.$name){
       Members.findOneAndUpdate({name: req.body.$name},{pic:result}).catch(err=>console.log(err.stack));
    }
    
    if(req.body.$visitor){

    }

    res.send({msg: 'تمت اضافة الصورة بنجاح', data:{img_url: result}, status:'200'});

    deleteFolder(file.path);

    res.end();
          
 }); 


 //ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

 //  D E L E T E   P R O F I L E   P I C T U R E 

 router.post('/delete-pic' , auth , async(req,res)=>{

   let username ;

   if(req.body.$name) username = req.body.$name;
   else username = req.body.$visitor;

   let result = await delete_file(username);
   if(!result) return res.status(400).send({msg:'حدث خطأ ما', data:null , status:'400'});

   if(req.body.$name){
      Members.findOneAndUpdate({name: req.body.$name},{pic:null}).catch(err=>console.log(err.stack));
   }
   
   if(req.body.$visitor){

   }

   return res.send({msg:'تم حذف الصورة بنجاح', data:null, status:'200'});
                   
 });

 
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