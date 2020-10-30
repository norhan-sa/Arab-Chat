
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const status_schema = new Schema({
   name:{
     type: String          
   },
   first_mem:{
     type: String        
   },
   second_mem: {
     type: String        
   },
   room:{
     type: String        
   },
   time: {
     type: Date        
   } 
 });

 const Status = mongoose.model('Status', status_schema);

 module.exports = Status;