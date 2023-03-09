let ul = document.getElementById('descriptionList');

ListenDescriptionList = ()  => {
  

    let elements = document.querySelectorAll('li.listItem');    
    
    
    elements.forEach((element, i) => {
        
        element.addEventListener("mouseover", (event) => { 
            console.log(`hovering ${element}`)
        });
    })





}
