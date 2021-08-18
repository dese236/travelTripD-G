// import { utilService } from './services/util.service.js'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

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
        })
        .catch(() => console.log('Error: cannot init map'));

}




function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    gWindow.close()
    mapService.addMarker(gCurrPos);

}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        const strHtml = locs
            .map((loc) =>
                `<tr><td>${loc.name}</td><td>address</td><td><button>Go</button><button>Delete</button></td></tr>`
            )
            .join('');
        document.querySelector('.locations-body').innerHTML = strHtml;
    });

}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
            document.querySelector(
                '.user-pos'
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
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