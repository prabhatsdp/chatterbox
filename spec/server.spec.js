const request = require('request');

describe('getMessages', () => {
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            console.log(res.statusCode);
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
    it('should return a list of messages', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            console.log(res.body);
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
        })
    })
})

describe('getMessages from Prabhat', () => {
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages/Prabhat', (err, res) => {
            console.log(res.statusCode);
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
    it('should return a list of messages by Prabhat', (done) => {
        request.get('http://localhost:3000/messages/Prabhat', (err, res) => {
            console.log(res.body);
            expect(JSON.parse(res.body)[0].senderName).toEqual('Prabhat');
            done();
        })
    })
})