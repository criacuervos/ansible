var socket = io.connect()

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  console.log(data)
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
})

function appendMessage(message){
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

