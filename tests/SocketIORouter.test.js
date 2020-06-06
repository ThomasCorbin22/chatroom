const SocketIORouter = require('../router/SocketIORouter.js')
const redis  = require('redis');

const redisClient = redis.createClient({
  host : 'localhost',
  port : 6379
});

redisClient.on('error', function(err){
    console.log(err);
});

let socketIORouter
let io
let room

describe('SocketIORouter testing', () => {
    
    beforeEach(() => {
        room = 'Test Room'
        socketIORouter = new SocketIORouter(io,redisClient)

        redisClient.del('Test Room')
    })

    test('SocketIORouter should return an empty list on initial request', () => {
        expect.assertions(1);
        
        return socketIORouter.lrange(room)
            .then((result) => {
                expect(result).toEqual([])
            })
    })

    test('SocketIORouter should add an item to a list', () => {
        expect.assertions(2);

        let msg = 'Hello there.'
        
        return socketIORouter.lrange(room)
            .then((result) => {
                expect(result).toEqual([])
            })
            .then(() => {
                socketIORouter.rpush(room, msg)
                return socketIORouter.lrange(room)
            })
            .then((result) => {
                expect(result).toEqual(['Hello there.']) 
            })
    })

    test('SocketIORouter should add multiple items to a list', () => {
        expect.assertions(4);

        let msg1 = 'Hello there.'
        let msg2 = 'General Kenobi.'
        let msg3 = "I dont't like sand."
        
        return socketIORouter.lrange(room)
            .then((result) => {
                expect(result).toEqual([])
            })
            .then(() => {
                socketIORouter.rpush(room, msg1)
                return socketIORouter.lrange(room)
            })
            .then((result) => {
                expect(result).toEqual(['Hello there.']) 
            })
            .then(() => {
                socketIORouter.rpush(room, msg2)
                return socketIORouter.lrange(room)
            })
            .then((result) => {
                expect(result).toEqual(['Hello there.', 'General Kenobi.']) 
            })
            .then(() => {
                socketIORouter.rpush(room, msg3)
                return socketIORouter.lrange(room)
            })
            .then((result) => {
                expect(result).toEqual(['Hello there.', 'General Kenobi.', "I dont't like sand."]) 
            })
    })
})