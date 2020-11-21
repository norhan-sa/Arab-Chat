
 const  client  =   require('./config/redis');
   
  let active_users = [];
  let rooms = [];
  let roomid = 0;

 //  C R E A T E   N E W   C H A T   R O O M
  function joinChat(nameSpace , name){
    nameSpace.on('connection', socket => {
      console.log(`${socket.id} connected to chat ${name}`);
    });        
  }

 //   T H E   M A I N   C H A T   A P P 
  function main_chat(nsp){
    
    nsp.on('connection', socket=>{
       
      console.log(`U S E R  C O N N E C T E D  ${socket}`);
    // TAKE USER DATA
      socket.on('data',data=>{   
        let user = find_user_byname(data.name);
        if(user){
          active_users[user.index].socket = socket.id;
        }else{
          data.socket = socket.id;
          active_users.push(data);
        }
      });

    // CREATE ROOM TO JOIN PRIVATE MESSAGING
     socket.on('create_room', data=>{ 
        // data = { room_name:  users: [{name: id: }]}
        let invitation_from = find_user_byID(socket.id).name;
        let roomID = roomid+'';
        ++roomid;
        socket.join(roomID);
        for(let i = 0 ; i < data.users.length ; ++i){
          let user = find_user_byname(users[i]);
          socket.to(user.socket).emit('join room',{roomID: roomID , room_name: room_name , invitation_from: invitation_from });
        }
        socket.emit('create_room',{msg:"Room created",status:"200",data:{roomID: roomID , room_name: room_name }});       
     });

    // JOIN TO THE ROOM
     socket.on('join room', data=>{
       socket.join(data.roomID);
     });

    // GROUP CHAT
     socket.on('group_message', data=>{
       // data = {roomID: msg: from:}
       nsp.to(data.roomID).emit('group_message' , data);
     });

    //  PRIVATE MESSAGINIG
     socket.on('private_message', data=>{
      // data = { from: to: msg: toID: } 
      let is_active = find_user_byname(data.to);  
      if(is_active){
        socket.emit('private_message',{data: data.msg , from: data.from , with: data.to , status:'200'});
        socket.to(is_active.socket).emit('private_message',{data: data.msg , from: data.from , with: data.from , status:'200'});
      }else{
        socket.emit('private_message',{msg:'المستخدم غير نشط', status:'400'});
      }  
     });
      
    });
  }

  //ــــــــــــــ F I N D   A C T I V E   U S E R    B Y   N A M E ـــــــــــــــــــ

  function find_user_byname(name) {
    for(let i = 0 ; i < active_users.length ; ++i){
      if(active_users[i].name === name){
        active_users[i].index = i;
        return active_users[i];
      } 
    }
    return;
  }

  //ــــــــــــــــــ F I N D   A C T I V E   U S E R   B Y   I D ـــــــــــــــــــــ

  function find_user_byID(id) {
    for(let i = 0 ; i < active_users.length ; ++i){
      if(active_users[i].socket === id)
       return active_users[i];
    }
    return;   
  }

  exports.joinChat = joinChat;
  exports.main_chat = main_chat;
  exports.actives = active_users;