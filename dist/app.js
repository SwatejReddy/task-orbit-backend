"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const User_1 = __importDefault(require("./db/User"));
const db_1 = __importDefault(require("./db/db"));
const constants_1 = require("./constants");
// Load environment variables
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
var corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true // to allow cookies from the client
};
var jsonOptions = {
    limit: constants_1.LIMIT // to prevent large payloads
};
var urlencodedOptions = {
    extended: true,
    limit: constants_1.LIMIT
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json(jsonOptions));
app.use(express_1.default.urlencoded(urlencodedOptions));
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
// Basic route
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = (yield User_1.default.findOne({ username: 'test' })) || false;
    if (exists) {
        console.log('User exists');
        return res.json(exists);
    }
    // create a new user
    else {
        const user = yield new User_1.default({
            username: 'test',
            email: 'test@gmail.com',
            password: 'password',
            salt: 'salt',
            name: 'Test User',
        });
        user.save().then(() => {
            console.log('User created');
        }).catch((error) => {
            console.log(error);
        });
        return res.json(user);
    }
    // res.json({ message: 'Server is running successfully!' });
}));
// Start the server
app.listen(port, () => {
    (0, db_1.default)().then(() => {
        console.log(`Server is running on port ${port}`);
    });
});
exports.default = app;
