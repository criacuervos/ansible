var socket = io.connect()

const nicknameContainer = document.getElementById('nickname-container')
const nicknameInput = document.getElementById('nickname-input')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let name = ""

appendMessage('welcome to the chat!')

socket.on('chat-message', data => {
  //here we check if its an array because thats how we load the previous chat data 
  if (Array.isArray(data)){
    //make a for loop here which will index into the array of objects 
    for(const message in data){
      appendMessage(`${data[message].name}: ${data[message].message}`)
    }
  } else if (!Array.isArray(data)){ //and this is how we send messages if its a new msg, new connection, or disconnect!
    appendMessage(`${data.name}: ${data.message}`)
  }
});

socket.on('user-connected', name => {
  appendMessage(`${name} joined the chat`)
})

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  const message = messageInput.value

  socket.emit('send-chat-message', {name, message})
  messageInput.value = ''

  window.setInterval(function() {
    let elem = document.getElementById('message-container');
    elem.scrollTop = elem.scrollHeight;
  }, 1000);
})

//limit the length of user nickname input here 
nicknameContainer.addEventListener('submit', event => {
  event.preventDefault()
  const user = nicknameInput.value
  name = user 
  socket.emit('new-user', name)
})

socket.on('user-disconnected', () => {
  appendMessage(`a user has disconnected`)
})

function appendMessage(message){
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

