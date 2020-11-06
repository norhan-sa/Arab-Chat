
 const  mongoose   =    require('mongoose');
 const   Agenda    =    require('agenda');
 const   config    =    require('dotenv').config();
 const  Members    =    require('../models/members');
 const   agenda    =    new Agenda({db: {address: process.env.DB}});

 let DB  = process.env.DB;

 mongoose.connect(DB , { useNewUrlParser: true ,  useUnifiedTopology: true} , (err,res)=>{

  
            if(err) console.log(`database connection error` , err.stack);

            else{

               console.log(`Connected to the database`);


                //  D E F I N E   T H E   A G E N D A 

                agenda.define('deleteExpiredSubscription' , async job=>{
                  
                  console.log('Hello from the other side');
                  
                  let members = await Members.find({expire_date:{$lte: new Date()}});

                  if(members.length > 0){
                    members.forEach(i=>{
                      i.sub = null;
                      i.save().catch(err=>console.log(err));
                    });
                  }

                });


                // D A I L Y   E X C U T E   T H E   A G E N D A

                (async function() { 
                  await agenda.start();
                  await agenda.every('1 days','deleteExpiredSubscription');
                })(); 
                            
              }
          }
 );

 