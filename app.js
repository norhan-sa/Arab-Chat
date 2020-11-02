 const   databast    =    require('./config/db');
 const   express     =    require('express');
 const    app        =    express();
 const    auth       =    require('./routes/authentication');
 const   session     =    require('express-session');
 const    test       =    require('./routes/testSession');
 const   give_roles  =    require('./routes/create_sub');
 const    blocks     =    require('./routes/block');


 app.use(express.json());

 app.use(session({ 
  secret: 'My_APP', 
  resave: false,  
  saveUninitialized: true
 }));

 app.use('/',auth);
 app.use('/',test);
 app.use('/',give_roles);
 app.use('/',blocks);
 app.get('/',(req,res)=>{
   return res.send('<h1><pre> W E L C O M E   T O  A R A B  C H A T </pre></h1>')
 });


 module.exports = app;