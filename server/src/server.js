import http from "http"
import createApp from "./app.js"
import { env } from "./common/config/env.js";
import { initSocket } from "./common/socket/socket.js";


const app = createApp();
const server = http.createServer(app);

initSocket(server)

server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
});