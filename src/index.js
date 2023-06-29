
import { PORT } from "./config";
import { server } from './app'
import { Server as SocketServer } from 'socket.io'

const httpServer = server.listen(PORT)

const io = new SocketServer(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    }
})


io.on('connection', (socket) => {
    socket.join(socket.handshake.query.myParam)
})

console.log('Server on port ' + PORT)