const socket =  io('http://localhost:3001');

const getNameData = document.getElementById('name');
const message = document.getElementById('message');
const messages = document.getElementById('messages');


const err = document.getElementById('err');
const errChat = document.getElementById('errChat');

const handleJoin = () => {
    if(getNameData.value == ''){
        err.innerHTML = 'Input Name!';
        getNameData.focus();
    }else{
        err.innerHTML = '';
        socket.emit('join', { name: getNameData.value });
    
        document.getElementById('onName').classList.add('hidden');
        document.getElementById('chat').classList.remove('hidden');
        document.getElementById('setName').appendChild(
            document.createTextNode(getNameData.value)
        );
    
    
        socket.emit('findAllMessages', data => {
            data.map(x => handleNewMassage(x));
        });
    
        message.focus();
    }
}


const handleSubmitNewRequest = () => {
    if(message.value == ''){
        errChat.innerHTML = 'Input Message!';
        message.focus();
    }else{
        errChat.innerHTML = '';
        socket.emit('createMessage', { text: message.value });
        message.value = '';
        message.focus();
    }
}

socket.on('message', res => {
    handleNewMassage(res);
});

handleNewMassage = (res) => {
    messages.appendChild(buildNewMassage(res));
};

const buildNewMassage = (res) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(res.name + ' => ' + res.text));
    return li;
}