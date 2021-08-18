import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchLoc = onSearchLoc;
window.onCopyLink = onCopyLink;

function onInit() {
  getQueryParams()
    .then((params) => {
      const lat = params['lat'] ? +params['lat'] : 32.0749831;
      const lng = params['lng'] ? +params['lng'] : 34.9120554;
      return { lat, lng };
    })
    .then(({ lat, lng }) => {
      mapService
        .initMap(lat, lng)
        .then(() => {
          console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    // console.log('Locations:', locs)
    // document.querySelector('.locs').innerText = JSON.stringify(locs)
    const strHtml = locs
      .map(
        (loc) =>
          `<tr><td>${loc.name}</td><td>address</td><td><button>Go</button><button>Delete</button></td></tr>`
      )
      .join('');
    //  return
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
