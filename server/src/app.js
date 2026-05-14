import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


import { env } from './common/config/env.js';
import { notFoundHandler, errorHandler } from './common/middleware/error.middleware.js';
import { authRouter } from './modules/auth/auth.route.js';
import { pollRoutes } from './modules/polls/poll.routes.js';



function createApp() {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(helmet())
    app.use(
        cors({
            origin: env.clientUrl,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        })
    )

    app.get("/health", (req, res) => {
        res.status(200).json({ success: true, message: "PulseKar API is running" });
    });

    app.use('/api/auth', authRouter)
    app.use('/api/polls', pollRoutes)



    app.use(notFoundHandler)
    app.use(errorHandler)


    return app;
}


export default createApp;