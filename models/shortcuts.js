
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;


 const shortcuts_schema = new Schema({
   word: {
     type: String          
   },
   decoration:{
     type: String        
   }
 });


 const Shortcuts = mongoose.model('Shortcuts', shortcuts_schema);

 module.exports = Shortcuts;