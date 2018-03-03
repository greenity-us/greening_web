/* global google */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MapWithASearchBox } from '../map';
import axios from 'axios';

export default class Heatmap extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    const {lat, lng} = this.props.initialCenter;
    this.updateData = this.updateData.bind(this);
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      },
      mapData: [
        {lat: 37.782, lng: -122.447, weight: 0.5},
        {lat: 37.782, lng: -122.443, weight: 2},
        {lat: 37.782, lng: -122.441, weight: 3},
        {lat: 37.782, lng: -122.439, weight: 2},
        {lat: 37.782, lng: -122.435, weight: 0.5},
        {lat: 37.785, lng: -122.447, weight: 3},
        {lat: 37.785, lng: -122.445, weight: 2},
        {lat: 37.785, lng: -122.441, weight: 0.5},
        {lat: 37.785, lng: -122.437, weight: 2},
        {lat: 37.785, lng: -122.435, weight: 3}
      ],
    }
  }

  // this component needs to know new position on drag end
  // and also pass the data into the heatmap component

  componentWillMount() {
    // make API request to get data here
  }

  updateData(newBounds, newCenter) {
    const NELat = newBounds.getNorthEast().lat();
    const NELng = newBounds.getNorthEast().lng();
    const SWLat = newBounds.getSouthWest().lat();
    const SWLng = newBounds.getSouthWest().lng();
    const url = `https://1yhfgkdznb.execute-api.us-west-2.amazonaws.com/dev/map_data?ne_lat=${NELat}&ne_lng=${NELng}&sw_lat=${SWLat}&sw_lng=${SWLng}`;

    // Following block of code will pass new data to heatmap
    // this.setState({
    //   mapData: [
    //     {lat: 37.785, lng: -122.447, weight: 3},
    //     {lat: 37.785, lng: -122.445, weight: 2},
    //     {lat: 37.785, lng: -122.441, weight: 0.5},
    //     {lat: 37.785, lng: -122.437, weight: 2}
    //   ]
    // });

    axios.get(url).then(
      // Use arrow function to keep 'this' bound to class
      (response) => {
        if (response.status === 200) {
          var filteredCoords = [];
          // parse data to convert to heatmap-friendly data
          console.log(response.data);
          for (var i = 0; i < response.data.tiles.length; i++) {
            var tile = response.data.tiles[i];
            const tileInfo = this.getTileCoord(tile);
            filteredCoords.push(tileInfo);
          }
          console.log(filteredCoords);
          this.setState({
            mapData: filteredCoords
          });
        }
    });
    return;
  }

  getTileCoord(tile) {
    const averageLat = (tile.tile_coords[0].lat + tile.tile_coords[1].lat + tile.tile_coords[2].lat + tile.tile_coords[3].lat) / 4
    const averageLng = (tile.tile_coords[0].lng + tile.tile_coords[1].lng + tile.tile_coords[2].lng + tile.tile_coords[3].lng) / 4
    return {lat: averageLat, lng: averageLng, weight: 10-tile.score}
  }
  
  render() {
    return (
      <MapWithASearchBox 
        center={this.state.currentLocation}
        zoom={12}
        onMove={this.updateData}
        heatmapRawData={this.state.mapData}
      >
      </MapWithASearchBox>
    );
  }
}

Heatmap.defaultProps = {
  // San Francisco by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  }
};

Heatmap.propTypes = {
  zoom: PropTypes.number,
  initialCenter: PropTypes.object
};