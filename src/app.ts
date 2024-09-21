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

// const API = '/api/v1';

//routes delcaration
app.use(`${API}/user`, userRouter);

// Basic route
app.get('/', async (req: Request, res: Response) => {
    const exists = await User.findOne({ username: 'test' }) || false;
    if (exists) {
        console.log('User exists');
        return res.json(exists);
    }
    // create a new user
    else {
        const user = await new User(
            {
                username: 'test',
                email: 'test@gmail.com',
                password: 'password',
                salt: 'salt',
                name: 'Test User',
            }
        )
        user.save().then(() => {
            console.log('User created');
        }).catch((error) => {
            console.log(error);
        });
        return res.json(user);
    }
    // res.json({ message: 'Server is running successfully!' });
});

// Start the server
app.listen(port, () => {
    connectDB().then(() => {
        console.log(`Server is running on port ${port}`);
    })
});

export default app;