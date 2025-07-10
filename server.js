const env = require('dotenv').config();
const PORT = env.parsed.PORT ? env.parsed.PORT : 3000;
const HOST = env.parsed.HOST ? env.parsed.HOST : 'localhost';
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./passport/passport');
const database = require('./database/database');
const mainRouter = require('./routes/mainRouter');
const apiRouter = require('./routes/apiRouter');
const chatRouter = require('./routes/chatRouter');
const initSocket = require('./ws/socketHandler');

const sessionMiddleware = session({
    secret: 'test123',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
});


app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', mainRouter);
app.use('/api', apiRouter);
app.use('/api/chat/', chatRouter);
server.listen(PORT, () => {
    console.log(`server started at: \n http://${HOST}:${PORT}`);
});
database();

io.engine.use(sessionMiddleware);
initSocket(io);