
 const mongoose    =   require('mongoose');
 const { Schema }  =   mongoose;


 const filter_schema = new Schema({
   word: {
     type: String          
   },
   type: {
     type: String        
   }
 });


 const Filter = mongoose.model('Filter', filter_schema);

 module.exports = Filter;