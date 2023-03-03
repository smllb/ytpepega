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

    //console.log(`check object on AddLinkToList \n${listObject.items[0].id}`)

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
            

            AddItemsToList(orderList, descriptionList, videoList)

            // AddItemsToList -> AddPropertiesToItems 


            
        }

    });
    videoList.items.forEach((item, i) => {

        console.log(`id: ${item.id} | title: ${item.title}`)
    });
    
}

AddPropertiesToItems = (orderItem, descriptionItem, itemClass, videoList) => {

    const identificationList = ["order", "description"];
    const itemsList = [orderItem, descriptionItem];
    let actualIndex = videoList.items.length-1;
    //console.log(`actualIndex: ${actualIndex}`)
    //console.log(`videoList: ${videoList.items[actualIndex].id}`)
    itemsList.forEach((element, i) => {

        let itemId = `${identificationList[i]}-${videoList.items[actualIndex].id}`;
        
        let descriptionContent =  `${videoList.items[actualIndex].title} ${videoList.items[actualIndex].id}`;
        let orderContent = actualIndex+1;

        element.setAttribute("id", itemId);
        element.textContent = identificationList[i] == "order" ? orderContent : descriptionContent;
        element.classList.add(itemClass)
        element.classList.add("listItem")
    });

}

AddItemsToList= (orderList, descriptionList, videoList) => {

        let itemsClass = videoList.items.length%2===0 ? "brighter" : "darker";
        let orderItem = document.createElement("li");
        let descriptionItem = document.createElement("li");

        AddPropertiesToItems(orderItem, descriptionItem, itemsClass, videoList);
        orderList.appendChild(orderItem);
        descriptionList.appendChild(descriptionItem);

        //console.log(`videoList: ${videoList}`)
    
}