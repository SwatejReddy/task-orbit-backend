import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import User from './db/User';
import User from './models/user.model';
import connectDB from './db/db';
import { LIMIT } from './constants';

// Load environment variables
const port = process.env.PORT || 3000;

const app: Application = express();



var corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true // to allow cookies from the client
}

var jsonOptions = {
    limit: LIMIT // to prevent large payloads
}

var urlencodedOptions = {
    extended: true, // to allow nested objects in query strings
    limit: LIMIT
}

app.use(cors(corsOptions));
app.use(express.json(jsonOptions));
app.use(express.urlencoded(urlencodedOptions));
app.use(express.static('public'));
app.use(cookieParser());

//routes import

import userRouter from './routes/user.routes'
import { API } from './constants';
import taskRouter from './routes/task.routes';

// const API = '/api/v1';

//routes delcaration
app.use(`${API}/user`, userRouter);
app.use(`${API}/task`, taskRouter);

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'Server is running successfully!' });
});

// Start the server
app.listen(port, () => {
    connectDB().then(() => {
        console.log(`Server is running on port ${port}`);
    })
});

export default app;