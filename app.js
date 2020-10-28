 const   databast    =   require('./config/db');
 const   express     =   require('express');
 const    app        =   express();
 const    auth       =   require('./routes/authentication');
 const   session     =   require('express-session');
 const  test         =   require('./routes/testSession');


 app.use(express.json());

 app.use(session({ 
  secret: 'My_APP', 
  resave: true,  
  saveUninitialized: true
 }));

 app.use('/',auth);
 app.use('/',test);

 app.get('/',(req,res)=>{
   return res.send('<h1><pre> W E L C O M E   T O  A R A B  C H A T </pre></h1>')
 });


 module.exports = app;