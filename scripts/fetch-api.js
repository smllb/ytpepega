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

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
  socket.send('sup from client');
  
});

socket.addEventListener('message', (event) => {
  console.log('Message received from server:', event.data);

  if(event.data == 'downloaded') {

    // change color
    
  }
  if(event.data == 'converted') {

    // delete from list 

  }
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

socket.addEventListener('error', (event) => {
  console.log('WebSocket connection error:', event);
});


SendVideoListToServer = (videoObj) => {

  selectedFiletype = document.getElementById('filetype').value;

  videoObj.filetype = selectedFiletype;

  fetch('http://localhost:3000/send-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(videoObj)
  }).then (response => {
    console.log('Request successful');
  })
  .catch(error => {
  console.log(`Request error: ${error}`);
  });

} 