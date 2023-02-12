let businessType;
let myMap;
let userCoords;
let placeMarker = null;

// Function for getting user coordinates
async function getCoords() {
    let location = await new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(resolve, reject);
     });

     return [location.coords.latitude, location.coords.longitude]   
 }
 
 async function buildMap(coords) {
    // Create map     
    myMap = L.map('map', {
        center: coords,
        zoom: 11,
    });

    // Add openstreetmap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 5,
        maxZoom: 30,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

    // Create and add a geolocation marker:
    const marker = L.marker(coords)
    marker.addTo(myMap).bindPopup('<p1><b>You Are Here</b></p1>').openPopup()

    addMarkersToMap(coords);
 }

 async function addMarkersToMap(coords)
 {
    // Remove exising markers
    if(placeMarker != null)
    {
        placeMarker.forEach(function(marker) {
            myMap.removeLayer(marker);
        })     
    }

    // Create red pin marker
    const redPin = L.icon({
        iconUrl: 'assets/red-pin.png',    
        iconSize:     [38, 38], // size of the icon    
        iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location   
    });

    let placeInfo = await buildFourSquareRequest(coords);
    placeMarker = placeInfo.map(function(place) {                
        return L.marker([place.latitude, place.longitude], {icon: redPin}).bindPopup(place.name);
    })
    
    L.layerGroup(placeMarker).addTo(myMap);    
 }

 async function buildFourSquareRequest(coords)
 {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq343clsd79E2Dnw9rmoOY7kCzeIIRO+Bxo1C4JJLElvXk='
        }
    };
    
    // Make the request
    let latitude, longitude;
    [latitude, longitude] = coords;
    let request = `https://api.foursquare.com/v3/places/nearby?ll=${latitude}%2C${longitude}&query=${businessType}&limit=5`
    console.log(request);

    // Process the response
    let response = await fetch(request, options);    
    let jsonResult = await response.json();

    // Store the relevant data
    console.log(jsonResult);
    let result = jsonResult.results.map(place => {
            return {
                'name' : place.name,
                'latitude' : place.geocodes.main.latitude,
                'longitude': place.geocodes.main.longitude
            }
        }
    )

    return result;
 }

 document.body.onload = async function() {
    let selectElement = document.getElementById('businessType');        
    businessType = selectElement.value;    
    selectElement.onchange = function() {    
        businessType = selectElement.value;  
        addMarkersToMap(userCoords);
    }

    userCoords = await getCoords();
    buildMap(userCoords);
 }


