export const locService = {
    getLocs
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createNewLocation(params) {


}

function getUserLocation(params) {

}

function saveToStorge(params) {
    //import

}

function loadFromStorage(params) {
    //import
}

function getLocation(params) {

}

function removeLocation(params) {

}

function transToCoord(params) {

}