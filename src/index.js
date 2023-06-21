import app from "./app";
import { PORT } from "./config";
import { server } from './app'
server.listen(PORT)
console.log('Server on port ' + PORT)