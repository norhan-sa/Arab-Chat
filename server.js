 const    app    =   require('./app');
 const    http   =   require('http');
 const   server  =   http.createServer(app);
 const     io    =   require('socket.io')(server);

  app.post('/Create_namespace', (req,res)=>{
      const chatNsp = io.of('/'+req.body.roomName);   
      joinChat(chatNsp , req.body.roomName);
      res.send(`room ${req.body.roomName} created successfully`);
  });
  
  app.post('/delete_namespace',(req,res)=>{
     const MyNamespace = io.of('/'+req.body.roomName); // Get Namespace
     const connectedNameSpaceSockets = Object.keys(MyNamespace.connected); // Get Object with Connected SocketIds as properties
     connectedNameSpaceSockets.forEach(socketId => {
         MyNamespace.connected[socketId].disconnect(); // Disconnect Each socket
     });
     MyNamespace.removeAllListeners(); // Remove all Listeners for the event emitter
     delete io.nsps['/my-namespace'];
     return res.send(`the ${req.body.roomName} is deleted successfully`);            

  });

  function joinChat(nameSpace , name){
          nameSpace.on('connection', socket => {
          console.log(`${socket.id} connected to chat ${name}`);
          /* chat namespace listeners here */
     });      
  }

 let port = process.env.PORT || 3000;

 server.listen(port, ()=>{
   console.log(`Listening to port ${port} . . . `);
 });


