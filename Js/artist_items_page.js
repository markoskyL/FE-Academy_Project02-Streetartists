const artistItemsPage = document.getElementById("artists/items")
const allCardsWrapper = document.getElementById("artist_cards")
const overlay = document.querySelector(".confirm-screen-overlay")
const confirmPopUp = document.querySelector(".confirm-popup")
const addNewItemButton = document.querySelector(".add-new-item")

let editingItem = ""
let editingItemNode
let editingItemIndex
let editingFlag = false

const renderArtistCard = (id,imgUrl, itemTitle, date, price, desc, published) =>{
    const cardWrapper = document.createElement("div")
    const card = document.createElement("div")
    const cardButtons = document.createElement("div")
    const sendToAucBtn = document.createElement("button")
    const publishBtn = document.createElement("button")
    const removeBtn = document.createElement("button")
    const editBtn = document.createElement("button")

    cardWrapper.classList.add("card-wrapper")
    cardWrapper.setAttribute("id", id)
    card.classList.add("card","light")
    cardButtons.classList.add("card-btns")
    sendToAucBtn.classList.add("send-to-auc")
    removeBtn.classList.add("remove")
    editBtn.classList.add("edit")

    sendToAucBtn.textContent = "Send to Auction"
    removeBtn.textContent = "Remove"
    editBtn.textContent = "Edit"

    sendToAucBtn.setAttribute("disabled","true") // Currently not working


    const cardInner =
        `   <img src="${imgUrl}" alt="art-image">
            <div class="card-text">
                <div class="name-price">
                    <div>
                        <h5 class="item-title">${itemTitle}</h5>
                        <p class="datum">${date}</p>
                    </div>
                    <span class="price">$${price}</span>
                </div>
                <p class="desc">${desc}</p>
            </div>
        `
    allCardsWrapper.append(cardWrapper)
    cardWrapper.append(card)
    card.innerHTML += cardInner
    card.append(cardButtons)

    if(!published){
        publishBtn.classList.add("publish")
        publishBtn.textContent = "Publish"
        cardButtons.append(sendToAucBtn,publishBtn,removeBtn,editBtn)
    }else{
        publishBtn.classList.add("unpublish")
        publishBtn.textContent = "Unpublish"
        cardButtons.append(sendToAucBtn,publishBtn,removeBtn,editBtn)
    }

}

const renderAllArtistCards = () =>{
    allCardsWrapper.innerHTML = ""
    const artistName = localStorage.getItem("artist")

    itemsLC = getItem("itemsLC")

    const artistItems = itemsLC ? itemsLC.filter(item => item.artist === artistName):
    items.filter(item => item.artist === artistName)

    artistItems.forEach(item =>{
        const date = new Date(item.dateCreated ).toLocaleDateString("en-GB")
        renderArtistCard(item.id,item.image, item.title, date, item.price, item.description, item.isPublished)
    })
}

allCardsWrapper.addEventListener('click', (e) => {
    const {target} = e
    const isButton = target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }
    const actionItem = target.closest(".card-wrapper")
    const actionItemId = actionItem.id
    const itemIndex = itemsLC.findIndex(item => item.id === +actionItemId)
    localStorage.setItem("itemID",actionItemId)

    if(target.matches(".remove")){
        overlay.classList.add("active")
        confirmPopUp.classList.add("active")
    }else if(target.matches(".publish")){
        target.classList.remove("publish")
        target.classList.add("unpublish")
        target.textContent = "Unpublish"
        itemsLC[itemIndex].isPublished = true;
    }else if(target.matches(".unpublish")){
        target.classList.add("publish")
        target.classList.remove("unpublish")
        target.textContent = "Publish"
        itemsLC[itemIndex].isPublished = false;
    }else if(target.matches(".edit")){
        editingFlag = true
        editingItem = itemsLC[itemIndex]
        editingItemNode = actionItem
        editingItemIndex = itemIndex
        location.hash = "artists/add-new-item"
        initEditMode()
    }
    updateItemsLC(itemsLC)

})

confirmPopUp.addEventListener("click", (e) =>{
    const {target} = e
    const itemID = localStorage.getItem("itemID")
    const itemToRemove = document.getElementById(itemID)
    const itemIndex = itemsLC.findIndex(item => item.id === +itemID)

    if(target.matches(".cancel")){
        overlay.classList.remove("active")
        confirmPopUp.classList.remove("active")

    }else if(target.matches(".confirm")){
        overlay.classList.remove("active")
        confirmPopUp.classList.remove("active")
        itemToRemove.remove()

        itemsLC.splice(itemIndex,1)
        updateArrIds(itemsLC)
        updateItemsLC(itemsLC)
        renderAllArtistCards()
    }

})

addNewItemButton.addEventListener("click", clearItemInputs)
