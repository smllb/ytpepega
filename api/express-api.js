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


exp.get('/key', (req, res) => {
  console.log("Retrieving apikey " + apiKey)
  res.json(apiKey);
  
});

ResetVideoList = () => {

  let emptyObject = [];
  fs.writeFile(VideoListPath, JSON.stringify(emptyObject), (err) => {

    if (err) {

      console.log('error while writing/wiping.');
      return console.log(err);

    }

    console.log(`wiped file at ${VideoListPath}`);

  });

}



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

wss.on('connection', (ws) => {
  console.table(ws)


  wss.clients.forEach((client) => {
    console.log(`trying to find clients`)
    if (client.readyState === WebSocket.OPEN) {
      console.log('found client' + client)
    
      
    }
    
  })

  console.log('WebSocket connection established at port 3000');
  UpdateHasListStatus(false, ws);
  ResetVideoList();
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    if (message == 'hasList') {

      UpdateHasListStatus(true, ws);
    }
    if (message == 'download') {

      ws.send('downloaded')

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

  console.log(`Retrieved video list from client.`)

  const jsonList = JSON.stringify(req.body);
  BulkDownload(jsonList, wss);
  
  res.send('video_list.json from received data');

})

module.exports = { exp, VideoListPath };