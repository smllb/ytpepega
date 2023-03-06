const { spawn } = require('child_process');
const VideoListPath = '/home/yogi/Documents/js/ytpepega/temp_data/video_list.json';
const path = require('path');
const fs = require('fs');
const { Worker, isMainThread } = require('worker_threads');



BulkDownload = (listJson, ws) => {

    //const jsonList = fs.readFileSync(VideoListPath, 'utf8');
    //const list = JSON.parse(jsonList);
    
    list = JSON.parse(listJson);
    console.log('Attempting download of list files ');

    let folderPath = '/home/yogi/Documents/js/ytpepega/downloads';
    let filetype = list.filetype;

    list.items.forEach((item, i) => {

        isConverted = false;
        let videoPath = `${folderPath}/${item.title}`;
        let ytdlp = spawn('yt-dlp', ['-f', 'b', '-o', `${videoPath}.mp4`, `${item.id}`]);
        let audioOutput = path.join('/home/yogi/Documents/js/ytpepega/downloads/', `${item.title}`);

        ytdlp.stdout.on('data', (data)=> {

            //console.log(`stdout: ${data}`);
        });

        ytdlp.stderr.on('data', (data) => {

            //console.error(`stderr: ${data}`);
        });

        ytdlp.on('close', (code) => {

            console.log(`yt-dlp process exited with code ${code} | successful download of ${item.title} at ${videoPath}.mp4`);
            item.converted = false;

            if (code === 0) {

                console.log(`Attempt to convert at ${videoPath}.mp4 with output to ${videoPath}.mp3 | converted status: ${item.converted}`);
                let ffmpeg = spawn('ffmpeg', ['-y', '-i', `${videoPath}.mp4`, '-b:a', '192K', '-vn', `${audioOutput}.mp3`]);

                ffmpeg.stdout.on('data', (data) => {

                    //console.log(`stdout: ${data}`);
                });

                ffmpeg.stderr.on('data', (data) => {

                    //console.error(`stderr: ${data}`);
                });

                ffmpeg.on('close', (code) => {

                    item.converted = true;
                    console.log(`ffmpeg process exited with code ${code}\n Deleting mp4 file at ${videoPath}.mp4 | item.converted status: ${item.converted}`);
                    
                    if (code != 0) {
                        console.log(`code: ${code} | failure`);
                        

                    }
                    
                    fs.unlink(`${videoPath}.mp4`, (err) => {

                        if (err) {

                            console.log('error encountered while deleting file. ' + err);
                        
                        } else {

                            console.log(`successfully deleted video at ${videoPath}.mp4`);
                       
                        }
                    });

                });
            } else {

                console.log(`error found sry`);

            }
        });
    });
};

module.exports = BulkDownload;

// reference
// Code 0 = success
// Code 1 = video unavailable
