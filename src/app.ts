import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables

const app: Application = express();

const port = process.env.PORT || 3000;

const limit = '16kb';

var corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true // to allow cookies from the client
}

var jsonOptions = {
    limit: limit // to prevent large payloads
}

var urlencodedOptions = {
    extended: true, // to allow nested objects in query strings
    limit: limit
}

app.use(cors(corsOptions));
app.use(express.json(jsonOptions));
app.use(express.urlencoded(urlencodedOptions));
app.use(express.static('public'));
app.use(cookieParser());

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Server is running successfully!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;