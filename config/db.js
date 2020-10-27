
 const mongoose   =   require('mongoose');
 const config     =   require('dotenv').config();

 let username  = process.env.DB_NAME;
 let password  =  process.env.DB_PASS;

 mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.q4jii.mongodb.net/<dbname>?retryWrites=true&w=majority` ,
  { useNewUrlParser: true ,  useUnifiedTopology: true} , (err,res)=>{
            if(err) console.log(`database connection error`);
            else console.log(`Connected to the database`);
          }
 );

 