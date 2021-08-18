export const locService = {
    getLocs,
    createLocation,
    saveLocatInStorage,
    loadFromStorage

}

const KEY = "locationsDB"

const locs = [
    createLocation('Tel-aviv', 32.082, 34.767, 'sunny'),
    createLocation('somewhere', 33.082, 34.767, 'sunny')
]

function saveLocatInStorage() {
    saveToStorage(KEY, locs)
}

function addLocation(params) {

}


function getLocs() {
    console.log(locs)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function createLocation(name, lat, lng, weather) {
    return {
        id: makeId(),
        name,
        lat,
        lng,
        weather,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()

    }

}

// function getUserLocation(params) {

// }

// function saveToStorge(params) {
//     //import

// }

// function loadFromStorage(params) {
//     //import
// }

// function getLocation(params) {

// }

// function removeLocation(params) {

// }

// function transToCoord(params) {

// }