var socket = io.connect()

const nicknameContainer = document.getElementById('nickname-container')
const nicknameInput = document.getElementById('nickname-input')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let name = ""

appendMessage('welcome to the chat!')

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
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

