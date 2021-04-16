
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
var marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)
.setPopup(new mapboxgl.Popup().setHTML(`<p>${campground.title}</p>`));