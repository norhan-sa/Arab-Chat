
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const users_schema = new Schema({
   name:{
     type: String,
     unique : true,
     required : true           
   },
   password: {
     type: String,
     required : true        
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
   },
   roles: {
      type: Array
   } 
 });

 const Members = mongoose.model('Members', users_schema);

 module.exports = Members;