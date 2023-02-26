
/*

for local testing purposes

const fetch = require('node-fetch');
const fs = require('fs');
const { query } = require('express');

*/

let urlElement = document.getElementById("url");
let videoList = {
    items: []
}

let reg = /\||\\|\/|:|\\?|"|<|>/;

verifyUrl = (url) => {

    const regexPlaylist = /(?:\?list=([\w]+))/;
    let urlData = {
        id: "",
        type: ""
    }
    let retrievedRegexFromPlaylist = regexPlaylist.exec(url)
    let playlistID = retrievedRegexFromPlaylist ? retrievedRegexFromPlaylist[1] : null;

    if (playlistID) {

        urlData.id = playlistID
        urlData.type = "playlist"
        return urlData

    } else {

        const regexVideo = /(?:(?:\.be\/|\/embed\/|\/v\/|\?v=)([\w\-]+))/;
        let retrievedRegexFromVideoUrl = regexVideo.exec(url);
        let videoID = retrievedRegexFromVideoUrl ? retrievedRegexFromVideoUrl[1] : null;
        
        if (videoID) {

            urlData.id = videoID;
            urlData.type = "video";
            return urlData;

        } else {

            urlData.type = null
            return urlData

        }
    }
}   

LogMinorEvent = (message) => {
    let minorEventsElement = document.getElementById("logMinorEvents");
    minorEventsElement.textContent = `${message}`;

}

// dom manipulation
CheckIfObjectHasValue = (obj, valueToFind) => {

    allObjectValuesArray = Object.values(obj)

    if (allObjectValuesArray.includes(valueToFind)) {

        return true

    } else {

        return false

    }
    
}

AddLinkToList = (listObject, urlInfo) => {

    //dom reference
    
    const orderList = document.getElementById(`orderList`);
    const descriptionList = document.getElementById(`descriptionList`);

    console.log(`check object on AddLinkToList \n${listObject.items[0].id}`)

    if (!urlInfo.type) {
        return  console.log("No ID found on this URL.")
    } 
    // add all to list 
    listObject.items.forEach((item, i) => {


        if (CheckIfObjectHasValue(videoList, item.id)) {
            console.log("Video already on the list, please insert another URL.")

        } else if (!CheckIfObjectHasValue(videoList, item.id)) {

            videoList.items.push(item);
            console.log(`Video with id ${item.id} added  successfuly ${item.title} to the list.`)
            

            AddItemsToList(orderList, descriptionList, videoList)

            // AddItemsToList -> AddPropertiesToItems 


            
        }

    });
    
}

AddPropertiesToItems = (orderItem, descriptionItem, itemClass, videoList) => {

    const identificationList = ["order", "description"];
    const itemsList = [orderItem, descriptionItem];
    let actualIndex = videoList.items.length-1;
    console.log(`actualIndex: ${actualIndex}`)
    console.log(`videoList: ${videoList.items[0].id}`)
    itemsList.forEach((element, i) => {

        let itemId = `${identificationList[i]}-${videoList.items[actualIndex].id}`;
        
        let descriptionContent =  `${videoList.items[actualIndex].title} ${videoList.items[actualIndex].id}`;
        let orderContent = actualIndex+1;

        element.setAttribute("id", itemId);
        element.textContent = identificationList[i] == "order" ? orderContent : descriptionContent;
        element.classList.add(itemClass)

    });

}

AddItemsToList= (orderList, descriptionList, videoList) => {

        let itemsClass = videoList.items.length%2===0 ? "brighter" : "darker";
        let orderItem = document.createElement("li");
        let descriptionItem = document.createElement("li");

        AddPropertiesToItems(orderItem, descriptionItem, itemsClass, videoList);
        orderList.appendChild(orderItem);
        descriptionList.appendChild(descriptionItem);

        console.log(`videoList: ${videoList}`)
    
}


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

let testUrls = ['https://www.youtube.com/watch?v=T3bdk8ch78I', 'https://www.youtube.com/playlist?list=PLFKZse17Cp_SjBRGJ9eIwYy9520VoCjMB', 'https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU', 'https://www.youtube.com/playlist?list=PLFsQleAWXsj_4yDeebiIADdH5FMayBiJo'];


// build url stuff/query 
PopulateList = async () => {

  url = urlElement.value;
  //url = testUrls[0];
  let urlInfo = verifyUrl(url)
  let listObject = await BuildListObject(urlInfo)
  console.log("Generated listObject:")
  listObject.items.forEach((item, i) => {
    console.log(`item ${i} : id ${item.id} | title: ${item.title}`)
    
  });

   AddLinkToList(listObject, urlInfo);

}

BuildListObject = async (urlObject) => {

      let apiKey = await isThereAnyApiKey();

      if (apiKey) {

            //do stuff with youtube api
            let baseURL = await BuildBaseUrl(urlObject, apiKey);
            //let baseURL =  'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&fields=items(status(privacyStatus),snippet(title,resourceId)),nextPageToken&playlistId=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU&maxResults=50&key=AIzaSyAmTKHroBNIhLxW3NWJ3m5J0pSxAooBzKc'
            let queryObject = await QueryDataFromApi(baseURL)
            let nextPageToken = queryObject.nextPageToken;
           
            if (urlObject.type === "playlist") {

                if (queryObject.nextPageToken) {

                    console.log(`\nPagetoken ${queryObject.nextPageToken} found. Playlist has more than 50 videos, iterating through all nextPageTokens to grab all available videos.`)
                    //console.log(queryObject)
                    while (nextPageToken) {
                       console.log(`\nEntering with token ${nextPageToken}`)
                       const nextQueryObject = await QueryDataFromApi(baseURL, nextPageToken);
                       queryObject = {
                        ...queryObject,
                        items: [...queryObject.items, ...nextQueryObject.items],
                        nextPageToken: [ nextQueryObject.nextPageToken]
                       }
                       nextPageToken = nextQueryObject.nextPageToken;
                       console.log(`Leaving with token ${nextPageToken}`)
                      
                   }
                  
                   return queryObject;
                    
                } else {

                   console.log('\nNo pagetoken found.')
                   
                   return queryObject;

                }

            } else if (urlObject.type === "video") {
                
                return queryObject;

            } else {

                console.log("Invalid operation")

            }

      } else {

        // straight node js child process with web socket/express api to handle downloads and feedback do update dom
     
    }

}

BuildBaseUrl = async (urlInfo, apiKey) => {
    
    if (urlInfo.type === "playlist") {

        let baseURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&fields=items(status(privacyStatus),snippet(title,resourceId)),nextPageToken&playlistId=${urlInfo.id}&maxResults=50&key=${apiKey}`
        console.log(`built http request for playlist as ${baseURL}`)
        return  baseURL
        

    } else if (urlInfo.type === "video") {

        let baseURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&field=snippet(title,thumbnails)&maxResults=50&id=${urlInfo.id}&key=${apiKey}`
        console.log(`built http request for video as \n${baseURL}`)
        return  baseURL

    }

}

QueryDataFromApi = async (baseURL, pageToken) => {

    url = await BuildQueryUrl(baseURL, pageToken)

    return fetch(`${url}`) 
        .then(console.log(`\nFetching ID: ${url}`))
        .then(response => response.json())
        .then(data => {
            const items = data.items
            .filter(item => item.status.privacyStatus === 'public')
            .map((item, i)=> ({

                id: (item.id) ? item.id : item.snippet.resourceId.videoId,
                title: item.snippet.title.replace(reg, "")
            }))  
            //console.log(items)
            //console.log(`Inside QueryDataFromApi after generating const items. items be like \n ${items}`)
            return {

                items: items,
                nextPageToken: (data.nextPageToken) ? data.nextPageToken : null

            }

        })

}

BuildQueryUrl = (baseURL, pageToken) => {
    const urlStructure = {
        base: baseURL,
        token: `&pageToken=${pageToken}`
    }
        console.log(`\nBaseURL ${urlStructure.base}`);

    if (pageToken) {
        console.log(`\nBuilt query URL as ${urlStructure.base+urlStructure.token} or ${urlStructure.base}${urlStructure.token}`)
        return urlStructure.base+urlStructure.token;

    }

    return urlStructure.base;
}








