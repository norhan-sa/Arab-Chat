
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const message_schema = new Schema({
   type:{
     type: String          
   },
   title:{
     type: String        
   },
   body: {
     type: String        
   }
 });

 const Messages = mongoose.model('Messages', message_schema);

 module.exports = Messages;