// export const localeStorage = {
//     saveToStorage,
//     loadFromStorage
// }

function saveToStorage(key, val) {
    localeStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
}