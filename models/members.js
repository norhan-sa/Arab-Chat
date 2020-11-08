
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
   pic: {
      type: String       
   },
   sub: {
      type: Schema.Types.ObjectId,
      ref: 'Subscriptions'
   },
   last_ip:{
      type: String
   },
   last_device: {
      type: String
   },
   device_id:{
      type: String
   },
   last_login: {
      type: Date
   },
   reg_date: {
      type: Date
   },
   token: {
      type: String
   },
   expire_date: {
      type: Date
   },
   likes: {
      type: Number,
      default: 0
   },
   is_certified: {
      type: Boolean
   },
   is_special: {
      type: Boolean
   } 
 });

 users_schema.plugin(AutoIncrement, {inc_field: 'id'});
 const Members = mongoose.model('Members', users_schema);

 module.exports = Members;