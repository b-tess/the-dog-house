const dogData = document.querySelector('.data')
const btnNext = document.getElementById('next')

let page = 0

const getBreedsConfig = {
    method: 'GET',
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

        // console.log(dogs.length)
        dogs.forEach((dog) => {
            const paragraph = document.createElement('p')
            paragraph.textContent = dog.name
            // dogData.textContent += JSON.stringify(dog)
            dogData.appendChild(paragraph)
        })
    } catch (error) {
        console.log(error)
    }
}

async function get5DogObjects() {
    try {
        const res = await fetch(
            `https://api.thedogapi.com/v1/breeds?limit=5&page=${page}`,
            getBreedsConfig
        )
        const dogs = await res.json()

        dogs.forEach((dog) => {
            const paragraph = document.createElement('p')
            paragraph.textContent = `Name: ${dog.name} Id: ${dog.id}`
            dogData.appendChild(paragraph)
        })
    } catch (error) {
        console.log(error)
    }
}

btnNext.addEventListener('click', () => {
    ++page
    get5DogObjects()
})

// getAllDogBreeds()
// get5DogObjects()
