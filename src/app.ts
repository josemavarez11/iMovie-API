/**
 * This file is the entry point for the iMovie API.
 * @author José Mavárez
 */

import express from 'express';

import mongoConnection from './db/mongoConnection';
import indexRouter from './routing/indexRouter';
import reqReceivedMiddleware from './middlewares/reqReceivedMiddleware';
import corsMiddleware from './middlewares/corsMiddleware';

const app = express();

const connectDB = async () => await mongoConnection();
    
connectDB();

app.use(express.json());
app.use(corsMiddleware);
app.use('/api', indexRouter);
app.use(reqReceivedMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`API started successfully🚀`));