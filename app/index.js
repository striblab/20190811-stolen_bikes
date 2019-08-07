/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
// /* global _ */

// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();


// Auto enable Pym for embedding.  This will enable a Pym Child if
// the url contains ?pym=true
utils.autoEnablePym();


// Adding dependencies
// ---------------------------------
// Import local ES6 or CommonJS modules like this:
// import utilsFn from './shared/utils.js';
//
// Or import libraries installed with npm like this:
// import module from 'module';

// Adding Svelte templates in the client
// ---------------------------------
// We can bring in the same Svelte templates that we use
// to render the HTML into the client for interactivity.  The key
// part is that we need to have similar data.
//
// First, import the template.  This is the main one, and will
// include any other templates used in the project.
// import Content from '../templates/_index-content.svelte.html';
//
// Get the data parts that are needed.  There are two ways to do this.
// If you are using the buildData function to get data, then ?
//
// 1. For smaller datasets, just import them like other files.
// import content from '../assets/data/content.json';
//
// 2. For larger data points, utilize window.fetch.
// let content = await (await window.fetch('../assets/data/content.json')).json();
//
// Once you have your data, use it like a Svelte component:
//
// const app = new Content({
//   target: document.querySelector('.article-lcd-body-content'),
//   data: {
//     content
//   }
// });

import * as d3 from 'd3';
// import * as mapboxgl from 'mapbox-gl';

//chart selection parameters
$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        return results[1] || 0;
    } else {
        return null;
    }
}

var selected = $.urlParam('chart');

if (selected != null) {
    // $(".slide").hide();
    $("#" + selected).show();
}
if (selected == "all") {
    $(".slide").show();
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG93ZmxhcmUiLCJhIjoiS3pwY1JTMCJ9.pTSXx_LFgR3XBpCNNxWPKA';

var dzoom = 10.5;
var mzoom = 10.5;
var center = [-93.265015, 44.977753];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/shadowflare/ciqzo0bu20004bknkbrhrm6wf',
    // center: [-93.264313, 44.973269],
    center: center,
    zoom: dzoom,
    minZoom: mzoom
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.doubleClickZoom.disable();

                
map.on('load', function() {

    map.addSource('nb2', {
        type: 'geojson',
        data: './shapefiles/minneapolis_nb.json'
    });

    map.addLayer({
        'id': 'nb2-layer',
        'interactive': true,
        'source': 'nb2',
        'layout': {},
        'type': 'fill',
        'paint': {
            'fill-antialias': true,
            'fill-color': 'rgba(255, 255, 255, 0)',
            'fill-outline-color': 'rgba(0, 0, 0, 1)'
        }
    }, 'road-primary');

    map.addSource('incidents', {
        type: 'geojson',
        data: './shapefiles/bikes.geojson'
    });

    map.addLayer({
        "id": "incidents-layer-1",
        "type": "circle",
        "source": "incidents",
        "paint": {
            "circle-radius": 2,
            "circle-color": '#3580A3',
            "circle-opacity": 0.5
        }
    }, 'place-neighbourhood');


    map.addSource('incidents2', {
        type: 'geojson',
        data: './shapefiles/pims.geojson'
    });

    map.addLayer({
        "id": "incidents-layer-2",
        "type": "circle",
        "source": "incidents",
        "paint": {
            "circle-radius": 2,
            "circle-color": '#3580A3',
            "circle-opacity": 0.5
        }
    }, 'place-neighbourhood');

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['nb2-layer'] });
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat)
            .setHTML("<div>" + feature.properties.Name + "</div>")
            .addTo(map);
    });

});

$(document).ready(function() {
    if ($("#wrapper").width() < 600) {
        map.flyTo({
            center: center,
            zoom: mzoom,
        });
    } else {
        map.flyTo({
            center: center,
            zoom: dzoom,
        });
    }
    $(window).resize(function() {
        if ($("#wrapper").width() < 600) {
            map.flyTo({
                center: center,
                zoom: mzoom,
            });
        } else {
            map.flyTo({
                center: center,
                zoom: dzoom,
            });
        }
    });
});