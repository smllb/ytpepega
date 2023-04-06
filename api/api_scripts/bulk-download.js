const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Worker, isMainThread } = require('worker_threads');
const WebSocket = require('ws');




const maxConversionsAtTheSameTime = 5;

SendCurrentStatus = (message, ws) => {

  ws.send(message)

}

DownloadFromList = (list, watcher, ws) => {

    console.log('Attempting download of list files ');

    let folderPath = path.join(__dirname, '/downloads')
    let filetype = list.filetype;

    list.items.forEach((item, i) => {

        isConverted = false;
        let videoPath = path.join( folderPath, item.title);
        let audioOutput = path.join( folderPath, `${item.title}`);

        //spawn download
        let ytdlp = spawn('yt-dlp', ['-f', 'b', '-o', `${videoPath}.mp4`, `${item.id}`]);
        //send info to client updating status to 'downloading'
        SendCurrentStatus(`downloading|${item.id}`, ws)

        let videoData = {
            videoPath: videoPath,
            audioOutput: audioOutput, 
            filetype: filetype,
            id: item.id,
            
        }
        
        ytdlp.stdout.on('data', (data)=> {

            //console.log(`stdout: ${data}`);
        });

        ytdlp.stderr.on('data', (data) => {

            //console.error(`stderr: ${data}`);
        });

        ytdlp.on('close', (code) => {

            //console.log(`yt-dlp process exited with code ${code} | successful download of ${item.title} at ${videoPath}.mp4`);
            
            //send info to client updating status to 'downloaded'
            SendCurrentStatus(`downloaded|${item.id}`, ws)

            if (code === 0) {

                // send info to queue to watcher
                console.log(`Sending ${item.title} info to watcher `)
                watcher.postMessage(videoData);
                

            } else {

                console.log(`error found with that vid sry`);
                SendCurrentStatus(`download_error|${item.id}`, ws)
            }
        });
    });

}

BulkDownload = async (list, ws) => {

    console.log('bulkdownload is on, trynna do stuff')
    const watcher = new Worker(`${__dirname}/workers/watcher.js`, { workerData: { maxConcurrent: maxConversionsAtTheSameTime } })

    //ws.send('im inside your walls')
    DownloadFromList(list, watcher, ws)

};

module.exports = BulkDownload;

