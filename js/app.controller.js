// import { utilService } from './services/util.service.js'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchLoc = onSearchLoc;
let gCurrPos;
let gWindow

function onInit() {
    mapService.initMap()
        .then((map) => {
            gWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: map.position,
            });
            gWindow.open(map);
            map.addListener("click", (ev) => {
                gWindow.close();
                gWindow = new google.maps.InfoWindow({
                    position: ev.latLng,
                });
                gWindow.setContent(
                    JSON.stringify(ev.latLng.toJSON(), null, 2)
                );
                gWindow.open(map);
                gCurrPos = ev.latLng
            });
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    // debugger
    locService.getLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log(gWindow)
    gWindow.close()
    mapService.addMarker(gCurrPos);
    // locService.addPositon(gCurrPos)

}

function onGetLocs() {

    locService.getLocs()
        .then(locs => {
            loadFromStorage(locs)

            const strHtml = locs.map(loc => `<tr><td>${loc.name}</td><td>address</td><td><button>Go</button><button>Delete</button></td></tr>`).join('')
                //  return      
            document.querySelector('.locations-body').innerHTML = strHtml

        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}



function onSearchLoc() {
    console.log('input');
    // locService.search()
}