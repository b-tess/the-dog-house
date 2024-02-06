const nameImageContainer = document.querySelectorAll('.name-image')
const moreInfoContainer = document.querySelector('.more-info-container')
const moreInfoIcons = document.querySelectorAll('.name-image .more-info-icon i')
const closeIcon = document.getElementById('close-icon')
const likeIcon = document.getElementById('like-icon')
const main = document.querySelector('main')
const imagesContainer = document.querySelector('.images-container')
const favoritesContainers = document.getElementsByClassName('favorites-data')
const btnNext = document.getElementById('next')
const btnPrev = document.getElementById('prev')
const showFavsBtn = document.getElementById('favorites-button')
const removeFavsBtns = document.querySelectorAll('.favorites-data button')
const dogData = document.querySelector('.data')
let allBreedsArray
let copyOfDogsArray
let added

let page = 0

const getBreedsConfig = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key':
            'live_RccA1xjRZi83cXhCxXEAUzBSAcNGtBepp8AenZHiUmMScC2it42WhVD3zyYJGDoe',
    },
}

const addToFavoritesConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key':
            'live_RccA1xjRZi83cXhCxXEAUzBSAcNGtBepp8AenZHiUmMScC2it42WhVD3zyYJGDoe',
    },
    body: {},
}

const removeConfig = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key':
            'live_RccA1xjRZi83cXhCxXEAUzBSAcNGtBepp8AenZHiUmMScC2it42WhVD3zyYJGDoe',
    },
}

async function getAllDogBreeds() {
    try {
        const res = await fetch(
            'https://api.thedogapi.com/v1/breeds',
            getBreedsConfig
        )
        const dogs = await res.json()

        return dogs
    } catch (error) {
        console.log(error)
    }
}

async function get5DogObjects() {
    try {
        //Get all breeds only once on page laod to get the
        //length of the array of results
        //This will help with pagination
        if (allBreedsArray === undefined) {
            allBreedsArray = await getAllDogBreeds()
        }
        const lastPage = Math.floor(allBreedsArray.length / 5)

        const res = await fetch(
            `https://api.thedogapi.com/v1/breeds?limit=5&page=${page}`,
            getBreedsConfig
        )
        const dogs = await res.json()
        copyOfDogsArray = [...dogs] //This will help populate the more-info section in HTML
        let index = 0

        nameImageContainer.forEach(function (container) {
            if (page === lastPage && !dogs[index]) {
                clearBreedsData(container)
            } else {
                disperseBreedsData.call(dogs[index], container)
                index++
            }
        })

        //Disable previous button on first page & next button on last page
        page === 0
            ? btnPrev.setAttribute('disabled', '')
            : btnPrev.removeAttribute('disabled')
        page === lastPage
            ? btnNext.setAttribute('disabled', '')
            : btnNext.removeAttribute('disabled')
    } catch (error) {
        console.log(error)
    }
}

//Add an image to favorites data
async function addedToFavs(id) {
    try {
        //Get the image id to help add it to favorites database
        const imageId = {
            image_id: id,
        }

        //Pass the id in the body of the post request
        addToFavoritesConfig.body = JSON.stringify(imageId)
        const response = await fetch(
            'https://api.thedogapi.com/v1/favourites',
            addToFavoritesConfig
        )
        const data = await response.json()
        return data.id
    } catch (error) {
        console.log(error)
    }
}

//Remove an image from favorites data
async function removeFromFavs(id) {
    try {
        const deleted = await fetch(
            `https://api.thedogapi.com/v1/favourites/${id}`,
            removeConfig
        )
        return deleted
    } catch (error) {
        console.log(error)
    }
}

//Get three of the available favorites objects to help with
//rendering them.
async function get3Favs() {
    try {
        const response = await fetch(
            'https://api.thedogapi.com/v1/favourites?limit=3',
            getBreedsConfig
        )
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

//Abstract the dispersal of returned data to relevant elements using context
function disperseBreedsData(container) {
    container.children[0].setAttribute('src', `${this.image.url}`)
    container.children[0].setAttribute('alt', `${this.name}`)
    container.children[1].textContent = this.name
    container.children[2].setAttribute('id', `${this.id}`)
}

//Clear the info in the elements without data on the last page on the UI
function clearBreedsData(container) {
    container.children[0].removeAttribute('id')
    container.children[0].removeAttribute('src')
    container.children[0].removeAttribute('alt')
    container.children[1].removeAttribute('id')
    container.children[1].textContent = ''
}

function binarySearch(array, id) {
    //Find the correct object to display using binary search?
    let start = 0
    let end = array.length //This is an array of objects

    while (start <= end) {
        let mid = Math.floor((start + end) / 2)

        if (parseInt(array[mid].id) === parseInt(id)) return array[mid]

        if (parseInt(array[mid].id) < parseInt(id)) {
            start = mid++
        } else {
            end = mid--
        }
    }
}

function disperseMoreInfo(container) {
    container.children[1].textContent = this.name
    container.children[2].setAttribute('src', `${this.image.url}`)
    container.children[2].setAttribute('alt', `${this.name}`)
    container.children[3].setAttribute('id', `${this.id}`)
    //Placeholder for objects without origin data
    if (this.origin === '' || this.origin === undefined) {
        container.children[4].textContent = 'Origin: unknown'
    } else {
        container.children[4].textContent = `Origin: ${this.origin}`
    }

    container.children[5].textContent = `Life Expectancy: ${this.life_span}`
    container.children[6].textContent = `Bred For: ${this.bred_for}`
    container.children[7].textContent = `Temperament: ${this.temperament}`
}

//Distribute the favorites data
function disperseFavsData(container) {
    container.children[0].setAttribute('src', `${this.image.url}`)
    container.children[0].setAttribute('alt', `${this.image.alt}`)
    container.children[1].setAttribute('id', `${this.favId}`)
}

//Clear the favorites data on click of remove button
function clearFavsData(container) {
    container.children[0].setAttribute('src', '')
    container.children[0].setAttribute('alt', '')
    container.children[1].setAttribute('id', '')
}

btnNext.addEventListener('click', () => {
    ++page
    get5DogObjects()
})

btnPrev.addEventListener('click', () => {
    --page
    get5DogObjects()
})

moreInfoIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
        //Add a class that affects the page layout
        main.classList.add('display-more-data')
        moreInfoContainer.classList.add('display-more-data')
        imagesContainer.classList.add('display-more-data')
        //Find correct element in the array to help with dispersing the data
        const dogDataObj = binarySearch(
            copyOfDogsArray,
            e.target.parentElement.id
        )

        disperseMoreInfo.call(dogDataObj, moreInfoContainer)
    })
})

//Remove the display-more-data styling on container close
closeIcon.addEventListener('click', () => {
    main.classList.remove('display-more-data')
    moreInfoContainer.classList.remove('display-more-data')
    imagesContainer.classList.remove('display-more-data')
})

//Toggle the styling of the like-icon
//Use th icon to add or remove an image from the favorites list
const likeIconClasses = likeIcon.classList
likeIcon.addEventListener('click', async (e) => {
    const addToFavorites = likeIconClasses.toggle('add-to-favorites')
    if (addToFavorites) {
        added = await addedToFavs(e.target.parentElement.id)
        console.log(added)
    } else {
        const removed = await removeFromFavs(added)
        console.log(removed)
    }
})

//Display the favorites data on button click
showFavsBtn.addEventListener('click', async () => {
    const favsData = await get3Favs()
    let favsObj = {
        image: {
            url: '',
            alt: '',
        },
        favId: '',
    }
    console.log(favsData)
    console.log(favoritesContainers)

    //The favs data returned doesn't seem to have the image property needed
    //to disperse the data correctly.
    //Solution: populate a large array on page load when getAllDogBreeds is
    //called. Call binarySearch on this array to find the correct object,
    //get the image info from this object.
    favsData.forEach((dataObj, index) => {
        let binarySearchObj = binarySearch(allBreedsArray, dataObj.image_id)
        favsObj.image.url = binarySearchObj.image.url
        favsObj.image.alt = binarySearchObj.image.alt
        favsObj.favId = dataObj.id

        disperseFavsData.call(favsObj, favoritesContainers[index])
    })
})

//Remove a favorite on button click
removeFavsBtns.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const deleted = await removeFromFavs(e.target.id)
        console.log(deleted)
        clearFavsData(e.target.parentElement)
    })
})

// getAllDogBreeds()
get5DogObjects()
