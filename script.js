console.log("Interactive Map");

async function getCoords() {
    let location = await new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(resolve, reject);
     });

     return [location.coords.latitude, location.coords.longitude]   
 }
 
 async function buildMap()
 {
    // Create map     
    let coords = await getCoords();                                                    
    const myMap = L.map('map', {
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
    marker.addTo(myMap).bindPopup('<p1><b>You are here</b></p1>').openPopup()

 }

 document.body.onload = function() {
    let selectElement = document.getElementById('businessType');        
    selectElement.onchange = function() {        
        console.log(selectElement.value);
    }

 }

 buildMap();