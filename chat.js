

  function joinChat(nameSpace , name){

    nameSpace.on('connection', socket => {

      console.log(`${socket.id} connected to chat ${name}`);
        /* chat namespace listeners here */
    });     
     
  }

  module.exports = joinChat;