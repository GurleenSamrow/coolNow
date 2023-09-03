let io;
const { Server } = require('socket.io');
const Chat = require('../models/chat')


const initChatService = (server) => {
    io = new Server(server,{
        cors:{
            origin : "*",
            methods:["GET","POST"]
        }
    });
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
  
      socket.on('sendMessage', async (data) => {
        if (data) {
            console.log("data",data)
           const chatMessage = new Chat({
            message:data.message,
            userId:data.userId,
            sender_id:data.sender_id,
            receiver_id: data.receiver_id,
            timestamp: new Date(),
          });
          await chatMessage.save();
        }
      });
    });
  };
  
  module.exports = {
    initChatService,
  };