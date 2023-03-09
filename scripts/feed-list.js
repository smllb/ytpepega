// global variables

let videoList = {
    items: []
}

AddToListAndUpdateResults = async () => {
    PopulateList().then(() => {
        socket.send('hasList');
    })

}







