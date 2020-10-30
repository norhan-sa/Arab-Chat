
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const logs_schema = new Schema({
   type: {
     type: String
   }, 
   name:{
     type: String,       
   },
   decoration: {
     type: String       
   },
   ip: {
     type: String       
   },
   device_type: {
     type: String       
   },
   country: {
     type: String,
   },
   date: {
     type: Date
   },
   source: {
     type: String
   },
   invite: {
     type: String
   } 
 });

 const Logs = mongoose.model('Logs', logs_schema);

 module.exports = Logs;