// import { utilService } from './services/util.service.js'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
// import {localeStorage} from './services/stroage.service.js'

const KEY = "locationsDB"


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchLoc = onSearchLoc;
window.onCopyLink = onCopyLink;
let gCurrPos;
let gWindow;

function onInit() {
    getQueryParams()
        .then((params) => {
            const lat = params['lat'] ? +params['lat'] : 32.0749831;
            const lng = params['lng'] ? +params['lng'] : 34.9120554;
            return { lat, lng };
        })
        .then(({ lat, lng }) => {
            return mapService.initMap(lat, lng)
        })
        .then((map) => {
            onShowWindow(map)
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onShowWindow(map) {
    console.log(map)
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
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    gWindow.close()
    console.log(gCurrPos.toJSON())
    const curPos = gCurrPos.toJSON()
    mapService.addMarker(gCurrPos);
    const name = prompt("enter name")
        // const weather = prompt("enter name")
    locService.addNewLocation(curPos, name)
    onGetLocs()
        // console.log('addres', gWindow.setContent(curPos.lan.formatted_address));
    const geoCoder = new google.maps.Geocoder()
    geoCoder.geocode({location :curPos}) 
    .then((res) => {
        console.log(gWindow.setContent(res.results[0].formatted_address));
    })
}


function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            // console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
            const strHtml = locs.map((loc,idx) => `
        <tr>
            <td>${loc.name}</td>
            <td>address</td>
            <td><button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
            <button data-idx=${idx} class="delete-btn">Delete</button></td>
            </tr>` ).join('')
            //  return      
            document.querySelector('.locations-body').innerHTML = strHtml
            document.querySelectorAll('.delete-btn').forEach(elBtn => {
                elBtn.addEventListener('click', onDeleteLoction)
            })
        })
}

function onDeleteLoction(ev) {
    // var locId =ev.dataset.id
    // console.log(locId);
   const idx =ev.target.getAttribute("data-idx");
    locService.getLocs()
        .then(locs => locs.splice(idx,1))
        onGetLocs()
}

function onGetUserPos() {
    // if(!gUserLoc)
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
                return {lat: pos.coords.latitude , lng : pos.coords.longitude }
        })
        .then(userLoc => {
            // saveToStorge('userLoc' , {lat: userLoc.lat , lng: userLng})
            mapService.panTo(userLoc.lat , userLoc.lng)})
        
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    if (!lat) lat = 35.6895
    if (!lng) lng = 139.6917
    // tokLat = 35.6895
    // tokLng = 139.6917
    mapService.panTo(32.071511741370415
        , 34.92146816462982
        );
    // mapService.panTo(lat, lng);
}


function onCopyLink() {
    const link = mapService.getLink();
    const elSpan = document.querySelector('.link-copied');
    elSpan.hidden = false;
    setTimeout(() => {
        elSpan.hidden = true;
    }, 1000);
    navigator.clipboard.writeText(link);
}

function onSearchLoc() {
    console.log('input');
    // locService.search()
}

function getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return Promise.resolve(params);
}



// function saveLocatInStorage() {
//     locStorage.saveToStorge(KEY, locs)
// }
// function loadFromStorage(params) {
//     locStorage.loadFromStorage(KEY)
// }
