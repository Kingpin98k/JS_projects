/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxsc3Rhcjk4ayIsImEiOiJjbGt4c3FyN3YxZG84M3FwbTl4bG82Y2VpIn0.BnW8jaN1z3k5FrbQcwplNA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/allstar98k/clkxu7bzu005r01p8cvdegtw9',
scrollZoom:false   //To allow only panning and not scrolling
});

//Creates the bounds to include current locations of the tour
const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    //Creating a marker
    const el = document.createElement('div')
    el.className = 'marker'   // We have a predefined css for this that makes a pin kind of object
    
    //Setting up the marker
    new mapboxgl.Marker({
        element:el,
        anchor:"bottom"    //place the bottom of the pin at the specified location
    }) 
    .setLngLat(loc.coordinates)   //[long,lat]
    .addTo(map)   //map object
    
    //Adding a popup
    new mapboxgl.Popup({
      offset:30          //To seperate the pin from popup description
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
    .addTo(map)

    //Extend bounds to include current locations
    bounds.extend(loc.coordinates)
});

//to fit the bounds defined above inside the map
//Moves and zooms the map to fit all the markers on the display
map.fitBounds(bounds,{
    padding:{
        left:100,
        right:100,
        top:150,
        bottom:150
    }
})

// mapboxgl.accessToken =
//   'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';

// const geojson = {
//   type: 'FeatureCollection',
//   features: [
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-112.987418, 37.198125]
//       },
//       properties: {
//         description: 'Zion Canyon National Park'
//       }
//     },
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-111.376161, 36.86438]
//       },
//       properties: {
//         description: 'Antelope Canyon'
//       }
//     },
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-112.115763, 36.058973]
//       },
//       properties: {
//         description: 'Grand Canyon National Park'
//       }
//     },
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-116.107963, 34.011646]
//       },
//       properties: {
//         description: 'Joshua Tree National Park'
//       }
//     }
//   ]
// };

// const map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/jonasschmedtmann/cjnxfn3zk7bj52rpegdltx58h',
//   scrollZoom: false
// });

// const bounds = new mapboxgl.LngLatBounds();

// geojson.features.forEach(function(marker) {
//   var el = document.createElement('div');
//   el.className = 'marker';

//   new mapboxgl.Marker({
//     element: el,
//     anchor: 'bottom'
//   })
//     .setLngLat(marker.geometry.coordinates)
//     .addTo(map);

//   new mapboxgl.Popup({
//     offset: 30,
//     closeOnClick: false
//   })
//     .setLngLat(marker.geometry.coordinates)
//     .setHTML('<p>' + marker.properties.description + '</p>')
//     .addTo(map);

//   bounds.extend(marker.geometry.coordinates);
// });

// map.fitBounds(bounds, {
//   padding: {
//     top: 200,
//     bottom: 150,
//     left: 50,
//     right: 50
//   }
// });

// map.on('load', function() {
//   map.addLayer({
//     id: 'route',
//     type: 'line',
//     source: {
//       type: 'geojson',
//       data: {
//         type: 'Feature',
//         properties: {},
//         geometry: {
//           type: 'LineString',
//           coordinates: [
//             [-112.987418, 37.198125],
//             [-111.376161, 36.86438],
//             [-112.115763, 36.058973],
//             [-116.107963, 34.011646]
//           ]
//         }
//       }
//     },
//     layout: {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     paint: {
//       'line-color': '#55c57a',
//       'line-opacity': 0.6,
//       'line-width': 3
//     }
//   });
// });
