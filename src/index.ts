import express from 'express';
import http from 'http';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import AppError from './utils/appError.js';
import globalErrorHandler from './controller/error.controller.js';
import responseHandler from './middleware/responseHandler.js';
import routes from './routes/index.route.js';
import env from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = env.PORT;

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb' }));

app.use(responseHandler);

app.use('/api/v1', routes);

app.use('/{*splat}', async (req, res, next) => {
    next(new AppError(`Nothing is associated with route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

server.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});
