fetch("https://jsonplaceholder.typicode.com/users")
.then(response => response.json())
.then(function(data){  // Renders options is every select
    allArtists = data.map(obj => obj.name)
    renderOptions(allArtists,selectJoinArtist)
    renderOptions(allArtists,filterArtists)
    renderOptions(itemTypes,type)
    renderOptions(itemTypes,newType)
})

if(!getItem("itemsLC")){ //If there is no items data in LC sets one
    updateItemsLC(items)
}

let itemsLC = getItem("itemsLC")

const publishedItems = itemsLC.filter(item => item.isPublished);

window.addEventListener("hashchange", handleRouting)
window.addEventListener("load", handleRouting)

document.addEventListener("click",(e)=>{
    const {target} = e

    if(target.closest(".join-artist-wrapper")){
        joinAsArtist()

    }else if(target.closest(".join-visitor")){
        location.hash = "visitor"

    }else if(target.matches(".find-now-btn") || target.matches(".slide img")){
        location.hash = "visitor/listing"

    }
})

function handleRouting(){
    let hash = location.hash
    if(!hash) location.hash = "home";
    document.querySelectorAll("section")
    .forEach(section => {
        `#${section.id}` !== hash ? section.style.display = "none" : section.style.display = "block";
    })

    let filtering = localStorage.getItem("filtering")
    switch (hash){
        case "#artists":
            renderNavName()
            renderArtist()
            initChart()
            break;

        case "#artists/items":
            renderNavName()
            renderAllArtistCards()
            break;
        case "#artists/add-new-item":
            renderNavName()
            break;

        case "#artists/capture-image" :
            renderNavName()
            startCamera()
            break;

        case "#visitor":
            setSlidePosition(slides,slidesWrapper)
            break;

        case "#visitor/listing":
            if(!filtering || filtering === "false"){ //Checks for the filtering flag in LC
                renderAllCards(publishedItems, cardsWrapper)
            }else{
                filterCards()
            }
            break;
    }

}

function updateItemsLC(array){ //Updates the data in local storage from an array
    localStorage.setItem("itemsLC", JSON.stringify(array))
    return true
}
function updateArrIds(array){  //Updates ID property of objects in an array
    for (let i = 0; i < array.length; i++) {
        const idVal = i+1
        array[i].id = idVal
    }
}

