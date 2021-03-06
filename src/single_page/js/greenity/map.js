// This example adds a user-editable rectangle to the map.
// When the user changes the bounds of the rectangle,
// an info window pops up displaying the new bounds.

var map;
var mapData;
var mapTiles = new Set();
var colors = {      // colors of tiles corresponding to their Greenity Score
    1: '#BF021E',
    2: '#FF0000',
    3: '#FF2E00',
    4: '#F95810',
    5: '#F67F31',
    6: '#F3A651',
    7: '#EEE182',
    8: '#EDF593',
    9: '#DDF594',
    10: '#80ff80'
};

function initMap() {
    //var center = new google.maps.LatLng(37.461021, -122.163314);
    var center = new google.maps.LatLng(37.550000, -122.163314);
    map = new google.maps.Map(document.getElementById('map-container'),
        {
            center: center,
            zoom: 10,
            minZoom: 10,
            mapTypeControl: false,
            streetViewControl: false
        }
    );
    /* Set map style */
    // Grayscale map
    //var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];
    //map.set('styles', styles);


    /* 'bounds_changed' event happens too frequently
     better to use 'idle' event that fires when map changed and now is idle.
     // google.maps.event.addListener(map, 'bounds_changed', function () {}
     */
    google.maps.event.addListener(map, 'idle', redrawMap);

}

function redrawMap() {
    /* redraw map's heatmap tiles and pollution sources */
    /* read the data from */
    console.log('redrawing map');
    var mapBounds = map.getBounds();
    console.log('mapBounds: ' + mapBounds);
    var ne = mapBounds.getNorthEast();
    var sw = mapBounds.getSouthWest();
    var url = 'https://1yhfgkdznb.execute-api.us-west-2.amazonaws.com/dev/map_data' +
        '?ne_lat=' + ne.lat() + '&ne_lng=' + ne.lng() + '&sw_lat=' + sw.lat() + '&sw_lng=' + sw.lng();
    console.log('url:', url);

    /* get data */
    $.ajax({
        url: url,
        success: function(result, status, xhr){
            mapData = result;
            //                console.log('map data:', mapData);
            var tileData = mapData['tiles'];
            //                console.log('tiles:', tileData.length);
            addHeatmapTiles(tileData);
            console.debug('LOADING TILES DONE');

            var pollutionSources = mapData['sources'];
            console.debug('pollution sources :', pollutionSources.length);
            addMarkersToMap(pollutionSources);
            console.debug('LOADING SOURCES DONE');
            console.debug('MAP DATA LOADING FINISHED');



        }
    });
}

function addMarkersToMap(markerData) {
    /* show markers for sources on the map */
    for (var c = 0; c < markerData.length; c++) {
        //            console.log('sources:', markerData[c]);
        var coords = {lat: markerData[c]['latitude'], lng: markerData[c]['longitude']};
        var markerTitle = markerData[c]['name'] + ',\n' + markerData[c]['address'];
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: markerTitle
        });
    }
}

function addHeatmapTiles(tileData) {
    /* show heatmap tiles for sources on the map */
    var num_tiles = tileData.length;
    //        console.log('num of tiles:', num_tiles);
    for(var c = 0; c < num_tiles; c++){
        var tile = tileData[c];
        var tid = tile['id'];
        if(! mapTiles.has(tid)) {
            var polygon = new google.maps.Polygon({
                id: tid,
                fillColor: colors[tile['score']],
                fillOpacity: 0.6,
                map: map,
                strokeWeight: 0,
                paths: tile['tile_coords']
            });
            mapTiles.add(tid);
        }
    }

}
