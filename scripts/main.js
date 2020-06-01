/// <reference path="./jquery-3.5.1.min.js" />
var socket = io();
$(document).ready(function () {
    console.log("Script Loaded.");
    $("#sendBtn").click(() => {
        if (!isInputValid()) {
            return;
        }
        postMessage({
            senderName: $('#userName').val(),
            messageText: $('#message').val(),
            dateTime: Date.now()
        });
    })
    getMessages();
});

socket.on('new_message', addMessage);

function addMessage(_message) {
    const currentTime = Date.now();
    var timePassed = currentTime - _message.dateTime;
    timePassed = (timePassed / 60000).toFixed(0);
    const _messageHtml = `<div class="card message-item">
            <h5>${_message.senderName}</h5>
            <p class="text">${_message.messageText}</p>
            <p class="time text-right">${timePassed} minutes ago</p>
        </div>`;
    $("#messages").append(_messageHtml);
}

function getMessages() {
    $.get('http://localhost:3000/messages', (data) => {
        data.forEach(addMessage);
    });
}

function postMessage(_message) {
    $.post('http://localhost:3000/messages', _message, (status) => {
        console.log(status);
    });
}

function isInputValid() {
    var isValid = true;
    if ($('#userName').val().length < 1) {
        console.log('User Name is Empty.');
        $('#userName').addClass('empty')
        isValid = false;
    } else {
        $('#userName').removeClass('empty')
    }
    if ($('#message').val().length < 1) {
        console.log('Message is Empty.');
        $('#message').addClass('empty')
        isValid = false;
    } else {
        $('#message').removeClass('empty')
    }

    return isValid;
}

