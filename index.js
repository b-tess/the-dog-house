const nameImageContainer = document.querySelectorAll('.name-image')
const moreInfoContainer = document.querySelector('.more-info-container')
// const dogImages = document.querySelectorAll('.name-image img')
const moreInfoIcons = document.querySelectorAll('.name-image .more-info-icon i')
const closeIcon = document.getElementById('close-icon')
const likeIcon = document.getElementById('like-icon')
const main = document.querySelector('main')
const imagesContainer = document.querySelector('.images-container')
const btnNext = document.getElementById('next')
const btnPrev = document.getElementById('prev')
const dogData = document.querySelector('.data')
let allBreedsArrayLength
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

        return dogs.length
        // allBreedsArrayLength = dogs.length
        // console.log(dogs.length)
        // dogs.forEach((dog) => {
        //     const paragraph = document.createElement('p')
        //     paragraph.textContent = dog.name
        //     // dogData.textContent += JSON.stringify(dog)
        //     dogData.appendChild(paragraph)
        // })
    } catch (error) {
        console.log(error)
    }
}

async function get5DogObjects() {
    try {
        //Get all breeds only once on page laod to get the
        //length of the array of results
        //This will help with pagination
        if (allBreedsArrayLength === undefined) {
            allBreedsArrayLength = await getAllDogBreeds()
        }
        const lastPage = Math.floor(allBreedsArrayLength / 5)

        const res = await fetch(
            `https://api.thedogapi.com/v1/breeds?limit=5&page=${page}`,
            getBreedsConfig
        )
        const dogs = await res.json()
        copyOfDogsArray = [...dogs] //This will help populate the more-info section in HTML
        // getArrayCopy(dogs)
        let index = 0

        nameImageContainer.forEach(function (container) {
            if (page === lastPage && !dogs[index]) {
                clearData(container)
                // disperseData.call(dogs[index], container)
                // index++
            } else {
                disperseData.call(dogs[index], container)
                index++
            }
        })

        page === 0
            ? btnPrev.setAttribute('disabled', '')
            : btnPrev.removeAttribute('disabled')
        page === lastPage
            ? btnNext.setAttribute('disabled', '')
            : btnNext.removeAttribute('disabled')
        // if (page === 0) {
        //     btnPrev.setAttribute('disabled', '')
        // }

        // if (page === lastPage) {
        //     btnNext.setAttribute('disabled', '')
        // }
        // dogs.forEach((dog) => {
        //     const paragraph = document.createElement('p')
        //     paragraph.textContent = `Name: ${dog.name} Id: ${dog.id}`
        //     dogData.appendChild(paragraph)
        // })
    } catch (error) {
        console.log(error)
    }
}

//Add an image to favorites data
async function addedToFavs(id) {
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
    // console.log(added)
    return data.id
}

//Remove an image from favorites data
async function removeFromFavs(id) {
    const deleted = await fetch(
        `https://api.thedogapi.com/v1/favourites/${id}`,
        removeConfig
    )
    return deleted
}

//Abstract the dispersal of returned data to relevant elements using context
function disperseData(container) {
    // container.children[0].setAttribute('id', `${this.id}`)
    container.children[0].setAttribute('src', `${this.image.url}`)
    container.children[0].setAttribute('alt', `${this.name}`)
    // container.children[1].setAttribute('id', `${this.id}`)
    container.children[1].textContent = this.name
    container.children[2].setAttribute('id', `${this.id}`)
}

//Clear the info in the elements without data on the last page
function clearData(container) {
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

function displayMoreInfo(container) {
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

btnNext.addEventListener('click', () => {
    ++page
    get5DogObjects()

    //Disable next button if last page in the breeds array is rendered
    // const lastPage = Math.floor(allBreedsArrayLength / 5)
    // if (page === lastPage) {
    //     e.target.setAttribute('disabled', '')
    // }
})

btnPrev.addEventListener('click', () => {
    --page
    get5DogObjects()

    //Disable previous button if first page in the breeds array is rendered
    // const lastPage = Math.floor(allBreedsArrayLength / 5)
    // if (page === 0) {
    //     e.target.setAttribute('disabled', '')
    // }
})

moreInfoIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
        //Add a class that affects the page layout
        main.classList.add('display-more-data')
        moreInfoContainer.classList.add('display-more-data')
        imagesContainer.classList.add('display-more-data')
        //Find correct element in the array
        const dogDataObj = binarySearch(
            copyOfDogsArray,
            e.target.parentElement.id
        )
        // console.log(`Data obj: ${dogDataObj}`)

        //Populate the relevant data
        displayMoreInfo.call(dogDataObj, moreInfoContainer)
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

// getAllDogBreeds()
get5DogObjects()
