const express = require('express');
const fs = require('fs');
const cors = require('cors');
const exp = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const BulkDownload  = require('./api_scripts/bulk-download.js')
const apiKey = JSON.parse(fs.readFileSync('./user_settings/settings.json')).apiKey.toString();
const VideoListPath = './temp_data/video_list.json';
exp.use(cors());
exp.use(bodyParser.json());

const clients = new Map();

exp.get('/key', (req, res) => {
  console.log("Retrieving apikey " + apiKey)
  res.json(apiKey);
  
});

 UpdateHasListStatus = (value, context) => {

  try {

    statusFilePath = './temp_data/status.json';
    const data = fs.readFileSync(statusFilePath, 'utf8');
    const statusObj = JSON.parse(data);
    statusObj.hasList = value;
    fs.writeFileSync(statusFilePath, JSON.stringify(statusObj), 'utf8');
    console.log('hasList at status.json updated with value ' + value);
  
    } catch (err) {

      console.error(err);

    }

 }

  
const wss = new WebSocket.Server({ server: exp.listen(3000) });
let browserClient;

wss.on('connection', (ws) => {

  if (!browserClient) {
    browserClient = ws;
  }

  console.log('WebSocket connection established at port 3000');
  UpdateHasListStatus(false, ws);

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    messageObj = JSON.parse(message);

    // downloading - > downloaded -> converting -> converted+deleted
    switch (messageObj.task) {
      case 'converting':
        browserClient.send(`converting|${messageObj.id}`)
        break;
      case 'finished':
        console.log(`Video with id ${messageObj.id} finished.`)
        browserClient.send(`finished|${messageObj.id}`)
        break
      case 'download':
        console.log('download procedure received successfuly')
        BulkDownload(messageObj.videoObj, ws);
        break
    }

    if (message == 'hasList') {

      UpdateHasListStatus(true, ws);
   
    }

    
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    console.log(`WebSocket connection error: ${error}`);
  });
});


exp.post('/send-list', (req, res) => {

  console.log(`Sending video list from client to download.`)
  const jsonList = JSON.stringify(req.body);
  console.table(client)
  BulkDownload(jsonList, client);
  

})

module.exports = { exp, VideoListPath };

// todo
// update dom --> downloading>converting>delete from dom
// create connection to websocket on the server side
// client x socket and server-side(workers) x socket x client desu