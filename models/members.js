
 const   mongoose     =   require('mongoose');
 const  { Schema }    =   mongoose;
 const AutoIncrement  =   require('mongoose-sequence')(mongoose);

 const users_schema = new Schema({
   name:{
     type: String,
     unique : true,
     required : true           
   },
   id: {
     type: Number 
   },
   decoration: {
     type: String 
   },
   password: {
     type: String,
     required : true        
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
   sub_name: {
      type: String,
   },
   sub_value: {
      type: Number,
      max: 9000
   },
   last_ip:{
      type: String
   },
   last_device: {
      type: String
   },
   last_login: {
      type: Date
   },
   reg_date: {
      type: Date
   } 
 });

 users_schema.plugin(AutoIncrement, {inc_field: 'id'});
 const Members = mongoose.model('Members', users_schema);

 module.exports = Members;