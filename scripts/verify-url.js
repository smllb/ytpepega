let urlElement = document.getElementById("url");

verifyUrl = (url) => {

    const regexPlaylist = /(?:[\?\&]list=([\w-]+))/;
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