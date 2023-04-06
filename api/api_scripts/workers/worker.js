const { workerData, parentPort } = require ('worker_threads')
const { spawn } = require('child_process');
const fs = require('fs');
const WebSocket = require('ws');


let count = 0;
parentPort.addEventListener('message', async (event) => {

    if (event.data.task === 'convert') {
        count++
        coreVideoData = {

            videoPath: event.data.videoData.videoPath,
            audioOutput: event.data.videoData.audioOutput,
            filetype: event.data.videoData.filetype,
            id: event.data.videoData.id
        }

        console.log('Worker received: ' + event.data.videoData.videoPath)
        //console.log(`${count} Receiving message to convert. Sent from worker.js | `)
        //console.log(`| ${count} |Received video with videoPath of: ${event.data.videoData.videoPath}`)
       console.log(count + " " + coreVideoData.videoPath)
       await ConvertToAudioAndDeleteVideo(coreVideoData)
       parentPort.postMessage({ prompt: 'finished' })
    }

})

ConvertToAudioAndDeleteVideo = (coreVideoData) => {

    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established on worker');
        //socket.send('sup from client');
        let isSocketConnected = true;
        

        let filetype = coreVideoData.filetype
        console.log('Received object from worker listener')    
        console.log(`Attempt to convert at ${coreVideoData.videoPath}.mp4 with output to ${coreVideoData.audioOutput}.mp3`);
        let ffmpeg = spawn('ffmpeg', ['-y', '-i', `${coreVideoData.videoPath}.mp4`, '-b:a', '192K', '-vn', `${coreVideoData.audioOutput}.mp3`]);
        socket.send(JSON.stringify({task: 'converting', id: coreVideoData.id}));
    
        ffmpeg.stdout.on('data', (data) => {
    
            //console.log(`stdout: ${data}`);
        });
    
        ffmpeg.stderr.on('data', (data) => {
    
            //console.error(`stderr: ${data}`);
        });
    
        ffmpeg.on('close', (code) => {
    
            console.log(`ffmpeg process exited with code ${code}\n Deleting mp4 file at ${coreVideoData.videoPath}.mp4`);
            socket.send(JSON.stringify({task: 'converted', id: coreVideoData.id}));
    
            if (code != 0) {
                console.log(`code: ${code} | failure`);
                
    
            }
            
            fs.unlink(`${coreVideoData.videoPath}.mp4`, (err) => {
    
                if (err) {
    
                    console.log('error encountered while deleting file. ' + err);
                    
                
                } else {
                    
                    console.log(`successfully deleted video at ${coreVideoData.videoPath}.mp4`);
    
                    socket.send(JSON.stringify({task: 'finished', id: coreVideoData.id}));
                }
            });
    
        });
      });
      
    
}