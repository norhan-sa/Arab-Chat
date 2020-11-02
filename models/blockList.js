
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;


 const  blocks_schema = new Schema({
   member_name: {
     type: String
   }, 
   mamber_id:{
     type: String,       
   },
   ip: {
     type: String       
   },
   device_id: {
     type: String       
   },
   os: {
     type: Array
   },
   browser: {
     type: Array
   },
   country_code: {
     type: String
   },
   date: {
     type: Date
   },
   ends_in: {
     type: String
   }
 });

 
 const Blocks = mongoose.model('Blocks', blocks_schema);

 module.exports = Blocks;