// fetch api for apikey

FetchApiKey= () => {
    return fetch('http://localhost:3000/key')
    .then(response => {
      return response.json();
    })
    .then(data => {
        //console.log(data)
        return data
    })
    .catch(error => console.error(error));

}

isThereAnyApiKey = async () => {
    let key = await FetchApiKey();
    if (!key) {
        return null
    } else {
        return key
    }
}

// connect to socket

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
  //socket.send('sup from client');
  
});

UpdateStatus = (command, id) => {

statusItem = document.getElementById(`status-${id}`)
statusItem.textContent =  command;

}

socket.addEventListener('message', (event) => {
  console.log('Message received from server:', event.data);
  const [command, id] = event.data.split("|");

  switch (command) {
    case 'downloading':
      UpdateStatus(command, id)
      break;
    case 'downloaded':
      UpdateStatus(command, id)
      break
    case 'converting':
      UpdateStatus(command, id)
      break
    case 'converted':
      UpdateStatus(command, id)
      break
    case 'finished':
      UpdateStatus(command, id)
      break
    case 'download_error':
      UpdateStatus('unavailable', id)
      break
  }
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

socket.addEventListener('error', (event) => {
  console.log('WebSocket connection error:', event);
});


SendVideoListToServer = (videoObj, socket) => {

  
  selectedFiletype = document.getElementById('filetype').value;
  videoObj.filetype = selectedFiletype;
  socket.send(JSON.stringify({ videoObj, task: 'download' }))

} 

