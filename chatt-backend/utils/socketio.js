import { Server } from 'socket.io';

class SocketIO {

  socketConnection (server) {

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*'
      }
    });
    return io;
    // this.io.on('connection', (socket) => {
    //   console.log('Connected to socket');

    //   socket.on('user connect', (userId) => {
    //     socket.join(userId);
    //       socket.in(userId).emit('user connected', userId);
    //   });

    //   socket.on('open container', (containerId) => {
    //     socket.join(containerId);
    //     console.log('user opened container', containerId);
    //   });
    //   console.log(db);
    //   const messages = db.collection('messages');
    //   const messagecontainers = db.collection('messagecontainers');
    //   const messageChangeStream = messages.watch();
    //   const msgContChangeStream = messagecontainers.watch();
    //   messageChangeStream.on('change', (change) => {
    //     // console.log('Change occured:', change);
    //     if (change.operationType === 'insert') {
    //       const messageDetails = change.fullDocument;
    //       const container = messageDetails.containerId;
    //       socket.in(container).emit('new message', messageDetails);
    //     }
    //   });
    //   msgContChangeStream.on('change', async (change) => {
    //     console.log('Change occured:', change);
    //     if (change.operationType === 'update') {
    //       // const containerDetails = change.updateDescription.updatedFields;
    //       const id = change.documentKey._id;
    //       const { default: MessageContainerController } = await import('../models/MessageContainers.js');
    //       MessageContainerController.findById(mongoose.Types.ObjectId(id))
    //         .then((container) => {
    //           container.members.forEach((member) => {
    //             socket.in(member).emit('container updated', container);
    //           });
    //         })
    //     }
    //   })
    // });
  }
}

const socketIO = new SocketIO();
export default socketIO;