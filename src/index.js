
import { PORT } from "./config";
import { server } from './app'
import { Server as SocketServer } from 'socket.io'
import { connect } from "./database"

const httpServer = server.listen(PORT)

const io = new SocketServer(httpServer, {
    cors: {
        origin: 'https://simonpine.com',
    }
})


io.on('connection', (socket) => {
    // socket.removeAllListeners()

    console.log('===================conn')

    socket.on('joinClub', evt => {
        socket.join(evt)
    })
    socket.on('newEventMessage', mess => {

        io.to(mess).emit('emitMessage', mess)
    })
    // socket.join('asdasd')

    // console.log(socket.rooms)
    // socket.on("disconnect", () => {
    //     console.log(socket.connected); // false
    // })

})

io.on('disconnection', (socket) => {
    console.log('desconectado');
})

console.log('Server on port ' + PORT)