import { config } from './config/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logs from './lib/Logs';
import authorRoutes from './routes/Author';
import bookroutes from './routes/Book';

const router = express();

/* connect to mongo  */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logs.info('Connected to the databse...');
        startServer();
    })
    .catch((error) => {
        Logs.error('Unable to connect to the database.');
        Logs.error(error);
    });

/* only start the server when databse connects successfully */
const startServer = () => {
    router.use((req, res, next) => {
        Logs.info(`Incomming -> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        req.on('finish', () => {
            /* Log the response */
            Logs.info(`Incomming -> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /* Rules */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /* Routes */
    router.use('/authors', authorRoutes);
    router.use('/books/', bookroutes);

    /* HealthCheck */
    router.get('/ping', (req, res, next) => {
        res.status(200).json({
            message: 'pong'
        });
    });

    /* Error Handling */
    router.use((req, res, next) => {
        const error = new Error('Not Found');
        Logs.error(error);
        return res.status(404).json({
            message: error.message
        });
    });

    http.createServer(router).listen(config.server.port, () => {
        Logs.info(`Server is running on port ${config.server.port}`);
    });
};
