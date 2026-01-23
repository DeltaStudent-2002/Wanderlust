
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [73.8786, 18.5204 ], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
console.log(coordinates);
const marker = new mapboxgl.Marker({
    color: 'red',
    draggable: true
    }).setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p><b>Extact Location Will Be Provided After Booking</b> </p>`)
    .setMaxWidth("500px"))
    .addTo(map); 
