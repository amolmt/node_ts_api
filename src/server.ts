import { config } from './config/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logs from './lib/Logs';

const router = express();

/* connect to mongo  */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logs.info('Connected to the databse...');
    })
    .catch((error) => {
        Logs.error('Unable to connect to the database.');
        Logs.error(error);
    });
