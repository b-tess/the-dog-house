const nameImageContainers = document.querySelectorAll('.name-image')
const moreInfoContainer = document.querySelector('.more-info-container')
const imagesContainer = document.querySelector('.images-container')
const favoritesContainers = document.getElementsByClassName('favorites-data')
const renderFavsContainer = document.querySelector('.render-favorites')
const moreInfoIcons = document.querySelectorAll('.name-image .more-info-icon i')
const closeIcon = document.getElementById('close-icon')
// const likeIcon = moreInfoContainer.children[3].firstElementChild
const main = document.querySelector('main')
const btnNext = document.getElementById('next')
const btnPrev = document.getElementById('prev')
const showFavsBtn = document.getElementById('favorites-button')
const removeFavsBtns = document.querySelectorAll('.favorites-data button')
const dogData = document.querySelector('.data')
const spinner = document.getElementById('spinner')
let allBreedsArray
let copyOfDogsArray
let likedImagesArray
// let added

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

function isLoading(loading = true) {
    if (loading) {
        spinner.classList.add('is-loading')
    } else {
        spinner.classList.remove('is-loading')
    }
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
        isLoading(true)
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

        nameImageContainers.forEach(function (container) {
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

        isLoading(false)
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
        isLoading(true)
        // if (likeIcon.classList.contains('add-to-favorites')) {
        //     likeIcon.classList.remove('add-to-favorites')
        // }
        await fetch(
            `https://api.thedogapi.com/v1/favourites/${id}`,
            removeConfig
        )
        // return deleted
    } catch (error) {
        console.log(error)
    }

    isLoading(false)
}

//Get three of the available favorites objects to help with
//rendering them.
async function getFavs() {
    try {
        isLoading(true)
        const response = await fetch(
            'https://api.thedogapi.com/v1/favourites?limit=3',
            getBreedsConfig
        )
        const data = await response.json()
        isLoading(false)
        return data
    } catch (error) {
        console.log(error)
    }
    isLoading(false)
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

    //Create a new like icon for every dog info object
    //This will help with keeping the styling unique
    //to a clicked icon leaving the other info objects
    //untouched.
    //This is because multiple info objects are using the same container
    //to display their different information.
    //This created a bug where the like icon is affected globally if
    //it is statically available in the HTML document.
    //Solution: create the icon dynamically in JS and give each
    //individual one it's own click event handler.
    const iconContainer = container.children[3]
    if (iconContainer.childElementCount > 0) {
        //Remove any previously present icon before creating a new one
        const prevLikeIcon = iconContainer.firstElementChild
        // console.log(prevLikeIcon)
        prevLikeIcon.remove()
    }
    const likeIcon = document.createElement('i')
    likeIcon.setAttribute('id', `${this.id}`)
    likeIcon.classList.add('fa-regular', 'fa-heart', 'fa-lg')

    //Check if this current dog info object is present in the array
    //of liked images so as to maintain the styling & functionality
    //of the like icon
    if (likedImagesArray.length > 0) {
        likedImagesArray.forEach((image) => {
            if (parseInt(image.image_id) === this.id) {
                likeIcon.classList.add('add-to-favorites')
            }
        })
    }
    iconContainer.appendChild(likeIcon)

    //Placeholder for objects without origin data
    if (this.origin === '' || this.origin === undefined) {
        container.children[4].textContent = 'Origin: unknown'
    } else {
        container.children[4].textContent = `Origin: ${this.origin}`
    }

    container.children[5].textContent = `Life Expectancy: ${this.life_span}`
    container.children[6].textContent = `Bred For: ${this.bred_for}`
    container.children[7].textContent = `Temperament: ${this.temperament}`

    likeIcon.addEventListener('click', () => likeHandler(likeIcon))
}

//Distribute the favorites data
function disperseFavsData(container) {
    container.children[0].setAttribute('src', `${this.image.url}`)
    container.children[0].setAttribute('alt', `${this.image.alt}`)
    container.children[1].setAttribute('id', `${this.favId}`)
}

//Clear the favorites data on click of remove button
function clearFavsData(container) {
    // container.children[0].setAttribute('src', '')
    // container.children[0].setAttribute('alt', '')
    // container.children[1].setAttribute('id', '')
    container.classList.add('no-data')
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
    icon.addEventListener('click', async (e) => {
        //Add a class that affects the page layout
        main.classList.add('display-more-data')
        moreInfoContainer.classList.add('display-more-data')
        imagesContainer.classList.add('display-more-data')
        // nameImageContainers.forEach((container) =>
        //     container.classList.add('display-more-data')
        // )
        //Find correct element in the array to help with dispersing the data
        const dogDataObj = binarySearch(
            copyOfDogsArray,
            e.target.parentElement.id
        )

        // console.log('dog data obj', dogDataObj)

        //Populate the liked images array to help with styling
        //the like icon of images already liked
        const likedData = await getFavs()
        likedImagesArray = [...likedData]
        // console.log(likedImagesArray)

        disperseMoreInfo.call(dogDataObj, moreInfoContainer)
    })
})

//Remove the display-more-data styling on container close
closeIcon.addEventListener('click', () => {
    main.classList.remove('display-more-data')
    moreInfoContainer.classList.remove('display-more-data')
    imagesContainer.classList.remove('display-more-data')
    // nameImageContainers.forEach((container) =>
    //     container.classList.remove('display-more-data')
    // )
})

closeIcon.addEventListener('mouseover', () => {
    closeIcon.classList.add('mouse-over')
})

closeIcon.addEventListener('mouseout', () => {
    closeIcon.classList.remove('mouse-over')
})

//Abstract the functionality of the like icon click event
async function likeHandler(element) {
    //Toggle the styling of the like-icon
    const addToFavorites = element.classList.toggle('add-to-favorites')

    //Use the icon to add or remove an image from the favorites list
    if (addToFavorites) {
        await addedToFavs(element.id)
        // console.log(added)
    } else {
        // console.log(likedImagesArray)
        const images = await getFavs()
        images.forEach((image) => {
            if (image.image_id === element.id) {
                removeFromFavs(image.id)
            }
        })
        // await removeFromFavs(added)
    }
}

//Display the favorites data on button click
showFavsBtn.addEventListener('click', async () => {
    isLoading(true)
    const favsData = await getFavs()
    // console.log('favs data', favsData)
    if (favsData.length === 0) {
        renderFavsContainer.classList.remove('display-more-data')
        renderFavsContainer.classList.add('no-favorites')
        isLoading(false)
        return
    } else {
        renderFavsContainer.classList.remove('no-favorites')
        renderFavsContainer.classList.add('display-more-data')
    }
    let favsObj = {
        image: {
            url: '',
            alt: '',
        },
        favId: '',
    }
    // console.log('favs data', favsData)
    // console.log(favoritesContainers)

    //The favs data returned doesn't seem to have the image property needed
    //to disperse the data correctly.
    //Solution: populate a large array on page load when getAllDogBreeds is
    //called. Call binarySearch on this array to find the correct object,
    //get the image info from this object.

    //A for loop helps with styling when the favsData array is < 3 elements long
    //The empty containers should have a display: none

    for (let i = 0; i < 3; i++) {
        if (favsData[i]) {
            if (favoritesContainers[i].classList.contains('no-data')) {
                favoritesContainers[i].classList.remove('no-data')
            }
            let binarySearchObj = binarySearch(
                allBreedsArray,
                favsData[i].image_id
            )
            favsObj.image.url = binarySearchObj.image.url
            favsObj.image.alt = binarySearchObj.image.alt
            favsObj.favId = favsData[i].id

            disperseFavsData.call(favsObj, favoritesContainers[i])
        } else {
            favoritesContainers[i].classList.add('no-data')
        }
    }
    isLoading(false)
})

//Remove a favorite on button click
removeFavsBtns.forEach((button) => {
    button.addEventListener('click', async (e) => {
        await removeFromFavs(e.target.id)
        // console.log(deleted)
        clearFavsData(e.target.parentElement)
    })
})

// getAllDogBreeds()
get5DogObjects()
