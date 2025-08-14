/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.location)
console.log('hello from the cient sde')

mapboxgl.accessToken = 'pk.eyJ1Ijoia3VubGV3ZWIiLCJhIjoiY21lOGphOGE0MGFldDJqcXhxZzdlejlhaSJ9.zDN1LAP3Z3Sren8M6PrHKw';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	
});