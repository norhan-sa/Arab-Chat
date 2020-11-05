
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;

 const sub_schema = new Schema({
   name:{
     type: String,
     unique : true,
     required : true           
   },
   value: {
     type: Number,
     required: true,
     max: 9999       
   },
   roles: {
     type: Array        
   },
   max_kicks: {
     type: Number      
   },
   max_gifts: {
     type: Number
   },
   max_adv: {
     type: Number        
   },
   max_constRooms: {
     type: Number        
   }  
 });

 const Subscriptions = mongoose.model('Subscriptions', sub_schema);

 module.exports = Subscriptions;