/* global google */
import React from 'react';
import { compose, withProps, lifecycle } from "recompose";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import _ from 'lodash';

export const MapWithASearchBox = compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: this.props.center,
        data: this.props.heatmapRawData,
        markers: [],
        mapData: [
          {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
          new google.maps.LatLng(37.782, -122.445),
          {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
          {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
          {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
          new google.maps.LatLng(37.782, -122.437),
          {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
          {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
          {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
          new google.maps.LatLng(37.785, -122.443),
          {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
          new google.maps.LatLng(37.785, -122.439),
          {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
          {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
        ],
        onMapMounted: ref => {
          refs.map = ref;
          // Check that browser supports navigator
          // Request location and set center there
          // Ideally only after user performs an action
          // if (navigator && navigator.geolocation) {
          //   navigator.geolocation.getCurrentPosition(
          //     (position) => {
          //       const coords = position.coords;
          //       this.setState({
          //         center: {
          //           lat: coords.latitude,
          //           lng: coords.longitude
          //         }
          //       });
          //     }
          //   )
          // }
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          }, function() {
            if (this.props.onMove) {
              this.props.onMove(this.state.bounds, this.state.center);
            }
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      });
    },
    componentWillReceiveProps(nextProps) {
      var filteredData = [];
      if (nextProps.heatmapRawData !== this.state.data) {
        this.setState({
          data: nextProps.heatmapRawData
        });
        for (var i = 0; i < nextProps.heatmapRawData.length; i++) {
          const point = nextProps.heatmapRawData[i];
          const htmapPoint = {
            location: new google.maps.LatLng(
              point.lat,
              point.lng
            ), 
            weight: point.weight
          };
          filteredData.push(htmapPoint);
        }
        // after loop is done, update heatmap data
        this.setState({mapData: filteredData});
      }
    },
  }),
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={props.zoom}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
    <HeatmapLayer
      data={props.mapData}
      options={{radius: 20}}
    />
  </GoogleMap>
);