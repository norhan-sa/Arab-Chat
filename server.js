 const    app     =    require('./app');
 const    http    =    require('http');
 const   server   =    http.createServer(app);
 const     io     =    require('socket.io')(server);
 const    Rooms   =    require('./models/rooms');
 const   Members  =    require('./models/members');
 const    Site    =    require('./models/wesite');
 const {joinChat,main_chat}  =    require('./chat');

 let site_data = [];

 async function find_data(){
   let data = await Site.findOne({id:1});
   site_data.push(data);
 }

 find_data();

  let nsp = io.of('/main'); 
  main_chat(nsp);

 //   C R E A T E   N E W   R O O M 

  app.post('/Create_namespace', async(req,res)=>{

      let { roomName, desc, welcome_msg, password, size, is_constant }  =  req.body;

      let isUsedName = await Rooms.findOne({name: roomName});
      if(isUsedName) return res.status(400).send({msg:'اسم الغرفة مستخدم بالفعل',data:null,status:'400'});

      const chatNsp = io.of('/'+ roomName);   
      joinChat(chatNsp , roomName);
      
      let room = new Rooms({
        name: roomName ,
        description: desc,
        welcome_msg: welcome_msg,
        password: password,
        size: size,
        is_constant: is_constant
      });
      
      room.save().then(()=>console.log('room saves')).catch((err)=>console.log(err.stack));

      let data = {
        name: roomName ,
        description: desc,
        welcome_msg: welcome_msg,
        size: size,
        is_constant: is_constant
      };

      return res.send({msg:`room ${roomName} created successfully`, data: data , status:'200'});

  });


  //   D E L E T E   T H E   R O O M

  app.post('/delete_namespace',(req,res)=>{

     let {roomID , roomName}  =  req.body;
     const MyNamespace = io.of('/'+ roomID); // Get Namespace
     const connectedNameSpaceSockets = Object.keys(MyNamespace.connected); // Get Object with Connected SocketIds as properties
     connectedNameSpaceSockets.forEach(socketId => {
         MyNamespace.connected[socketId].disconnect(); // Disconnect Each socket
     });
     
     MyNamespace.removeAllListeners(); // Remove all Listeners for the event emitter
     delete io.nsps['/my-namespace'];

     Rooms.remove({name:roomName},(err,res)=>{
        if(err) console.log(err.stack);
        else console.log('Room removed successfully');
     });

     return res.send(`the ${roomName} is deleted successfully`);   

  });
  
 //  C O N N E C T I N G   T O   T H E   S E R V E R

  let port = process.env.PORT || 3000;

  server.listen(port, ()=>{
    console.log(`Listening to port ${port} . . . `);
  });


 exports.site_data = site_data;