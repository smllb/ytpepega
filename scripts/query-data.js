// build url stuff/query 
PopulateList = async () => {

    url = urlElement.value;
    if (url === "") {
        LogMinorEvent("Please insert a link.")
        return 0
    }

    let urlInfo = verifyUrl(url)

    if (urlInfo.type === null ) {

        LogMinorEvent("Please provide a valid link.")
        return 0 
    }

    let listObject = await BuildListObject(urlInfo)

    if (listObject.totalResults < 1 || !listObject.items) {
        LogMinorEvent("Please provide a valid link.")
        return 0 
    }

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
  
          let baseURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&fields=pageInfo(totalResults),items(status(privacyStatus),snippet(title,resourceId)),nextPageToken&playlistId=${urlInfo.id}&maxResults=50&key=${apiKey}`
          console.log(`built http request for playlist as ${baseURL}`)
          return  baseURL
          
  
      } else if (urlInfo.type === "video") {
  
          let baseURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&field=snippet(title,thumbnails)&maxResults=50&id=${urlInfo.id}&key=${apiKey}`
          console.log(`built http request for video as \n${baseURL}`)
          return  baseURL
  
      }
  
  }
  
  QueryDataFromApi = async (baseURL, pageToken) => {
  
      let reg = /\||\\|\/|:|\\?|"|<|>/;
  
      url = await BuildQueryUrl(baseURL, pageToken)
  
      return fetch(`${url}`) 
          .then(console.log(`\nFetching ID: ${url}`))
          .then(response => response.json())
          .then(data => {
              if (!data.items) {
                LogMinorEvent('Please provide a valid link.')
                return 0
              }
              const items = data.items
              .filter(item => item.status.privacyStatus === 'public')
              .map((item, i)=> ({
  
                  id: (item.id) ? item.id : item.snippet.resourceId.videoId,
                  title: item.snippet.title.replace(reg, "")
              }))  

              console.log('checking for results' + data.pageInfo.totalResults)
              return {
  
                  items: items,
                  nextPageToken: (data.nextPageToken) ? data.nextPageToken : null,
                  totalResults: data.pageInfo.totalResults
  
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
  