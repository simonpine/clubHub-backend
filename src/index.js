
import { PORT } from "./config";
import { server } from './app'
import { Server as SocketServer } from 'socket.io'

const httpServer = server.listen(PORT)

const io = new SocketServer(httpServer, {
    cors: {
        origin: 'https://www.uhub.website',
        // origin: 'http://localhost:3000',
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
    socket.on('newChatMessage', mess => {
        io.to(mess.idClub).emit('emitMessageChat', mess)
    })
})

io.on('disconnection', (socket) => {
    console.log('desconectado');
})

console.log('Server on port ' + PORT)