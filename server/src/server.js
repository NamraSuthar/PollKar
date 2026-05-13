import http from "http"
import createApp from "./app.js"
import { env } from "./common/config/env.js";


const app = createApp();
const server = http.createServer(app);


server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
});