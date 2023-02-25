
const fetch = require('node-fetch');

//let urlElement = document.getElementById("url");
let videoList = [];
let currentIndex = videoList.length;

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

AddLinkToList = () => {
    
    url = urlElement.value;
    let urlInfo = verifyUrl(url);

    // console.log(`URL: ${id}`)
    if (!urlInfo.type) {
        return LogMinorEvent("No ID found on this URL.")
    } 

    if (urlInfo.type === "playlist") {
        // fetch playlist all tokens etc populate videolist, update html 

    } else if (urlInfo.type === "video" && !videoList.includes(urlInfo.id)) {

        LogMinorEvent(`Video with ID ${urlInfo.id} added successfuly to the list.`);
        videoList.push(urlInfo.id);
        // Creation of both uls on order/description

        const orderList = document.getElementById(`orderList`);
        const descriptionList = document.getElementById(`descriptionList`);

        // add lis as needed
        AddItemsToList(orderList, descriptionList, videoList)

    } else { 

        LogMinorEvent("Video already on playlist, please insert another URL.")
    
    }
    
}


AddPropertiesToItems = (orderItem, descriptionItem, itemClass, videoList) => {

    const identificationList = ["order", "description"];
    const itemsList = [orderItem, descriptionItem];

    itemsList.forEach((element, i) => {

        let itemId = `${identificationList[i]}Item${videoList.length}`;
        
        let descriptionContent =  videoList[videoList.length-1];
        let orderContent = videoList.length;

        element.setAttribute("id", itemId);
        element.textContent = identificationList[i] == "order" ? orderContent : descriptionContent;
        element.classList.add(itemClass)

    });

}


AddItemsToList= (orderList, descriptionList, videoList) => {

        let itemsClass = videoList.length%2===0 ? "brighter" : "darker";
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

// build url stuff/query 

BuildListObject = async () => {

}



BuildBaseUrl = async (urlInfo) => {
    let apiKey = await isThereAnyApiKey();
    if (urlInfo.type === "playlist") {

        let baseURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&fields=items(status(privacyStatus),snippet(title,resourceId)),nextPageToken&playlistId=${urlInfo.id}&maxResults=50&key=${apiKey}`
        console.log(`built http request for playlist as ${baseURL}`)
        return  baseURL
        

    } else if (urlInfo.type === "video") {

        let baseURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&field=snippet(title,thumbnails)&maxResults=50&id=${urlInfo.id}&key=${apiKey}`
        console.log(`built http request for video as ${baseURL}`)
        return  baseURL

    }

}

QueryDataFromApi = async (baseURL, pageToken) => {

    baseURL = await BuildQueryUrl(baseURL, pageToken)

    return fetch(`${url}`) 
        .then(console.log(`Fetching ID: ${url}`))
        .then(response => response.json())
        .then(data => {
            const items = data.items
                .filter(item => item.status.privacyStatus === 'public')
                .map((item, i) => ({

                    id: item.id,
                    title: item.snippet.title.replace(reg, "")
                    
            }))

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

    if (pageToken) {
        return urlStructure.base+urlStructure.token;

    }

    return urlStructure.base;
}








