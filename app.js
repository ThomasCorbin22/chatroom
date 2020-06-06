const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const publicDirectory = __dirname + '/public'
const router = require('./router/router')(express, publicDirectory);
const setupPassport = require('./passport/init-passport');
const port = process.env.PORT || 8080;

const SocketRouter = require('./router/SocketIORouter')

const server = https.createServer({
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
},app);

const io = require('socket.io').listen(server);

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
}));

setupPassport(app);

app.use('/app-03', router);

const initSessions = require('./sessions/init-sessions.js')

const redis  = require('redis');

const redisClient = redis.createClient({
  host : 'localhost',
  port : 6379
});

redisClient.on('error', function(err){
    console.log(err);
});

initSessions(app,io,redisClient);

new SocketRouter(io,redisClient).router();

server.listen(port);

module.exports = redisClient;