 const   databast    =    require('./config/db');
 const   express     =    require('express');
 const    cors       =    require('cors');
 const    app        =    express();
 const    auth       =    require('./routes/authentication');
 const   session     =    require('express-session');
 const    test       =    require('./routes/testSession');
 const   give_roles  =    require('./routes/control panel/create_sub');
 const    blocks     =    require('./routes/control panel/block');
 const   shortcut    =    require('./routes/control panel/shortcuts');
 const    filter     =    require('./routes/control panel/filter');
 const  logs_status  =    require('./routes/control panel/status&logs');
 const   members     =    require('./routes/control panel/members');
 const   messages    =    require('./routes/control panel/messages');
 const    pic        =    require('./routes/profile/update_picture');
 const   prof        =    require('./routes/profile/update_profile');

 app.use(express.json());
 app.use(express.static('public'));


 app.use(session({ 
  secret: 'My_APP', 
  resave: false,  
  saveUninitialized: true
 }));

 app.use(cors());
 app.all((req,res,next)=>{
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 if(req.method === 'OPTIONS'){
   res.header('Access-Control-Allow-Methods','PUT , POST , PATCH , DELETE , GET');
   return res.status(200).json({});
 }
 next();
 });

 app.use('/',auth);
 app.use('/',test);
 app.use('/',give_roles);
 app.use('/',blocks);
 app.use('/',shortcut);
 app.use('/',filter);
 app.use('/',logs_status);
 app.use('/',members);
 app.use('/',messages);
 app.use('/',pic);
 app.use('/',prof);
 app.get('/',(req,res)=>{
   let a = req.headers.referer;
   const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return res.send('<h1><pre> W E L C O M E   T O  A R A B  C H A T </pre></h1>'+'\n\n\n'+a+'\n\n\n'+clientIp);
 });

 module.exports = app;