
import { PORT } from "./config";
import { server } from './app'
import { Server as SocketServer } from 'socket.io'

const httpServer = server.listen(PORT)

const io = new SocketServer(httpServer, {
    cors: {
        origin: 'https://clubhub-backend.up.railway.app',
    }
})


io.on('connection', (socket) => {
    console.log('user connected ' + socket.id)
})

console.log('Server on port ' + PORT)