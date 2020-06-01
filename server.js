const express = require('express');
const bodyParser = require('body-parser');
const fileSystem = require('fs');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
mongoose.Promise = Promise;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbConfig = JSON.parse(fileSystem.readFileSync('./configs/dbconfig.json', 'UTF-8'));
var Message = mongoose.model('Message', {
    senderName: String,
    messageText: String,
    dateTime: Number
})

const dbUrl = `mongodb+srv://${dbConfig.dbUserName}:${dbConfig.dbPassword}@${dbConfig.coreUrl}/${dbConfig.collection}?retryWrites=true&w=majority`;

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.get('/messages/:user', (req, res) => {
    const user = req.params.user;
    Message.find({ senderName: user }, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', async (req, res) => {
    console.log(req.body);

    try {
        const message = new Message(req.body);
        const savedMessage = await message.save();
        console.log('Message Saved.');
        const censored = await Message.findOne({ messageText: 'badword' });
        if (censored) {
            console.log('Badwords found in message.');
            await Message.deleteOne({ _id: censored.id });
        } else {
            io.emit('new_message', req.body);
            res.sendStatus(200);
        }

    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    } finally {
        //todo: free up resources here that you don't need further 
    }


})

io.on('connection', (socket) => {
    console.log('A User Connected.');
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log('MongoDB Connection : ', err);

})

const server = http.listen(3000, () => {
    console.log(`Server is listening to port ${server.address().port}`);
});