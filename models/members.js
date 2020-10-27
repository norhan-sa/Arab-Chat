 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const users_schema = new Schema({
   name:{
     type: String          
   },
   password: {
     type: String        
   },
   role: {
      type: String       
   },
   muted: {
      type: Boolean      
   },
   blocked: {
      type: Boolean       
   },
   pic: {
      type: String       
   } 
 });

 const Members = mongoose.model('Members', users_schema);

 module.exports = Members;