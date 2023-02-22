let urlElement = document.getElementById("url");


verifyUrl = (url) => {
    //  get entire URL -> check if its a playist -> return id  or check if its a video -> return id or ?????
    const regexPlaylist = /(?:\?list=([\w]+))/;

    let retrievedRegexFromPlaylist = regexPlaylist.exec(url)
    let playlistID = retrievedRegexFromPlaylist ? retrievedRegexFromPlaylist[1] : null;
    //console.log(url)
    if (playlistID) {
        
        return playlistID

    } else {

        const regexVideo = /(?:(?:\.be\/|\/embed\/|\/v\/|\?v=)([\w\-]+))/;
        let retrievedRegexFromVideoUrl = regexVideo.exec(url);
        let videoID = retrievedRegexFromVideoUrl ? retrievedRegexFromVideoUrl[1] : null;
        
        if (videoID) {
            return videoID

        } else {
            return false

        }
    }
}   
let videoList = [];
let currentIndex = videoList.length;
AddLinkToList = () => {

    
    
    url = urlElement.value;
    let id = verifyUrl(url);

    // console.log(`URL: ${id}`)
 
    
    
    if (id && !videoList.includes(id)) {

        videoList.push(id);
        // Creation of both uls on order/description

        const orderList = document.getElementById(`orderList`);
        const descriptionList = document.getElementById(`descriptionList`);

        // add lis as needed
        AddItemsToList(orderList, descriptionList, videoList)
    } else {
        console.log("Video already on playlist, please insert another URL.")


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
// will retrieve id in group 1(?:(?:\.be\/|\/embed\/|\/v\/|\?v=)([\w\-]+)) 
