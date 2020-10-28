
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const rooms_schema = new Schema({
   name:{
     type: String          
   },
   name_space:{
     type: String        
   },
   pic: {
     type: String        
   },
   description:{
     type: String        
   },
   welcome_msg: {
     type: String        
   },
   password: {
     type: String         
   },
   size: {
     type: Number    
   },
   is_constant: {
     type: Boolean
   } 
 });

 const Rooms = mongoose.model('Rooms', rooms_schema);

 module.exports = Rooms;