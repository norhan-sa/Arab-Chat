  
 const admin = require('firebase-admin'); 
 const serviceAccount = require('./firebase_config.json');

 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   storageBucket: "gs://arab-chat-148f2.appspot.com" 
 });

 var bucket = admin.storage().bucket();


 //   U P L O A D   F I L E S   T O   F I R E B A S E

 async function upload_file(filePath , mimeType , username){

  try{

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: username
      },
      contentType: mimeType
    };

    const options = {
      destination: username,
      predefinedAcl: 'publicRead',
      gzip: true,
      metadata: metadata,
    };

   let result = await bucket.upload(filePath, options);

   let data = result[0].metadata;
   let url = "https://firebasestorage.googleapis.com/v0/b/arab-chat-148f2.appspot.com/o/"+data.name+"?alt=media&token="+data.metadata.firebaseStorageDownloadTokens; 

   console.log(`${filePath} uploaded.`);
   return url;

  }catch(err){
    console.log(err.stack);
    return;
  }

 }

 async function delete_file(file_name){
  
  try{

   let x = await bucket.deleteFiles({
     prefix: file_name
   }); 

   return 'done';

  }catch(err){
   console.log(err.stack);
   return;
  } 

 };


 exports.upload_file = upload_file;
 exports.delete_file = delete_file;

 
//  async function a(){ 

          // const options = {
          //          destination: 'vedio.mp4',
          //          predefinedAcl: 'publicRead'
          //          };
                   
            //        let x = await bucket.deleteFiles({
            //         prefix: `oo.mp4`
            //  });        
         
//            let x = await bucket.upload('./oo.mp4',options);
//            console.log(x);
         
//  }
         
//  a();
