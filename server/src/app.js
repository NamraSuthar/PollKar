import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './common/config/env.js';
import { notFoundHandler, errorHandler } from './common/middleware/error.middleware.js';
import { authRouter } from './modules/auth/auth.route.js';
import { pollRoutes } from './modules/polls/poll.routes.js';
import { responseRoutes } from './modules/responses/response.routes.js';
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createApp() {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(helmet())
    app.use(
        cors({
            origin: [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
            credentials: true
        })
    )

    app.get("/health", (req, res) => {
        res.status(200).json({ success: true, message: "PollKar API is running" });
    });

    app.use('/api/auth', authRouter)
    app.use('/api/polls', pollRoutes)
    app.use('/api/responses', responseRoutes)
    app.use('/api/analytics', analyticsRoutes)

    // Serve frontend static files
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    // SPA fallback: serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });

    app.use(notFoundHandler)
    app.use(errorHandler)


    return app;
}


export default createApp;
