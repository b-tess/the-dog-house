const dogData = document.querySelector('.data')

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

getAllDogBreeds()
