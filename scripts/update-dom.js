// dom manipulation

LogMinorEvent = (message) => {
    let minorEventsElement = document.getElementById("logMinorEvents");
    minorEventsElement.textContent = `${message}`;

}
CheckIfObjectHasValue = (obj, valueToFind) => {

   let hasValue = false;

    obj.items.forEach((item, i) => {

        //console.log(`obj.item.id ${item.id} | valueToFind ${valueToFind} | ${item.id === valueToFind}`)
                if (item.id === valueToFind) {

            hasValue = true;
    
        }   
    });

    return hasValue
    
}

AddLinkToList = (listObject, urlInfo) => {

    //dom reference
    
    const orderList = document.getElementById(`orderList`);
    const descriptionList = document.getElementById(`descriptionList`);
    const statusList = document.getElementById(`statusList`);

    if (!urlInfo.type) {
        return  console.log("No ID found on this URL.")
    } 
    // add all to list 
    listObject.items.forEach((item, i) => {

        let hasValue = CheckIfObjectHasValue(videoList, item.id);
        
        //console.log(`${item.id} = ${hasValue}`)
        if (hasValue) {
            LogMinorEvent(" Already on the list, please insert another URL.")

        } else if (!hasValue) {

            videoList.items.push(item);
            LogMinorEvent(`Items added  successfuly to the list.`)
            

            AddItemsToList(orderList, descriptionList, videoList, statusList)

        }

    });
    
}

AddPropertiesToItems = (orderItem, descriptionItem, itemClass, videoList, statusItem) => {

    const identificationList = ["order", "description", "status"];
    const itemsList = [orderItem, descriptionItem, statusItem];
    let actualIndex = videoList.items.length-1;

    itemsList.forEach((element, i) => {
        let itemId = `${identificationList[i]}-${videoList.items[actualIndex].id}`;
        
        let descriptionContent =  `${videoList.items[actualIndex].title} ${videoList.items[actualIndex].id}`;
        let orderContent = actualIndex+1;

        element.setAttribute("id", itemId);
        //element.textContent = identificationList[i] == "order" ? orderContent : descriptionContent;
        switch(identificationList[i]) {
            case "order":
            element.textContent = orderContent;
                break;
            case "description":
            element.textContent = descriptionContent;
                break;
            case "status":
            element.textContent = 'pending'
                break;
        }
        element.classList.add(itemClass)
        element.classList.add("listItem")
        
    });

}

AddItemsToList= (orderList, descriptionList, videoList, statusList) => {

        let itemsClass = videoList.items.length%2===0 ? "brighter" : "darker";
        let orderItem = document.createElement("li");
        let descriptionItem = document.createElement("li");
        let statusItem = document.createElement("li")

        AddPropertiesToItems(orderItem, descriptionItem, itemsClass, videoList, statusItem);
        orderList.appendChild(orderItem);
        descriptionList.appendChild(descriptionItem);
        statusList.appendChild(statusItem)
        //console.log(`videoList: ${videoList}`)
    
}