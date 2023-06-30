
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
    socket.on('joinClub', evt => {
        console.log('user connected to: ' + evt)
        socket.join(evt)
    })
    socket.on('newEventMessage', mess => {
        io.to(mess.idClub).emit('emitMessageEvent', mess)
    })
})

io.on('disconnection', (socket) => {
    console.log('desconectado');
})

console.log('Server on port ' + PORT)