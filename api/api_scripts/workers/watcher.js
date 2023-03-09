const { Worker } = require('worker_threads');
const { workerData, parentPort } = require('worker_threads'); 
const { createPool } = require('generic-pool');
const maxConcurrent = workerData.maxConcurrent;
const ws = workerData.ws;

const factory = {
    create: (data) => {
        const worker = new Worker(`${__dirname}/worker.js`, { workerData: data })
        return worker
        
    },
    destroy: (worker) => {
        worker.terminate();

    }

}

let queue = [];
const pool = createPool(factory, { max: 5 });

ProcessQueue =  (pool, data) => {

  let workersInUse = pool.borrowed;
  queue.push(data)
  

  if (queue.length > 0 || queue.length == 0 && workersInUse == 0) {

    if(workersInUse < maxConcurrent) {

      AcquireWorkerAndReportResult(pool, queue.shift(), ProcessQueue)
      

    } else if (workersInUse >= maxConcurrent) {

      console.log(`Amount of workers in use: ${workersInUse} | ${data.videoPath} added to queue.`)
 
    }

  } 

} 

AcquireWorkerAndReportResult = (pool, data, callbackToProcessQueue) => {

  pool.acquire({ workerData: data })
  .then((worker) => {

    worker.postMessage({ task: 'convert', videoData: data });

    worker.once('message', (result) => {

      console.log(`Worker returned result. ${result}`)
      parentPort.postMessage(result);
      pool.release(worker);
      if (queue.length > 0) {
        console.log(`Queue is still not empty, processing queue again to convert next tasks.`)
        callbackToProcessQueue(pool, queue.shift());
      } 
    });
  })
  .catch((err) => {

    console.error(err);
    
  });

}

  parentPort.on('message', data => {
    console.log(`Received ${data} from main thread | sending ${data.videoPath}`)
    
    ProcessQueue(pool, data)

  })

  //pool.drain().then(() => pool.clear());

