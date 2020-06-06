class SocketIORouter {

    constructor(io, redisClient) {
        this.io = io;
        this.chatroom = null;
        this.arrayOfRoom = new Set()
        this.redisClient = redisClient
    }

    router() {
        this.io.on('connection', this.connection.bind(this));
    }

    connection(socket) {
        console.log('a user connected to the socket');

        socket.on('subscribe', async (room) => {
            socket.join(room);
            console.log(" a User has joined our room: " + room);

            this.chatroom = room;
            this.arrayOfRoom.add(room);
            let previousMessages = await this.lrange(room)

            this.io.to(this.chatroom).emit("previous messages " + room, previousMessages);

            socket.on("chat message " + room, async (msg, user) => {
                msg = user + ": " + msg;
                console.log(msg)

                await this.rpush(room, msg)

                this.io.to(this.chatroom).emit("chat message " + room, msg);
            });
        });

        socket.on('disconnect', () => {
            console.log('a user left us')
        });
    }

    rpush(room, msg) {
        return new Promise((resolve, reject) => {
            this.redisClient.rpush(room, msg, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                resolve()
            });
        })
    }

    lrange(room) {
        return new Promise((resolve, reject) => {
            this.redisClient.lrange(room, 0, 10, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    console.log(data)
                    resolve(data)
                }
            })
        })
    }
}

module.exports = SocketIORouter