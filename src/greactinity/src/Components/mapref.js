import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";

const SearchInput = (props) => {
  return (
    <input 
      type="text" 
      id="search-input" 
      placeholder="Search for an address or area"
    />
  );
}

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.addRefToState = this.addRefToState.bind(this);
    this.state = {
      boxRef: null
    }
  }

  addRefToState(boxNode) {
    this.setState({
      boxRef: boxNode
    });
  }
  
  handlePlacesChanged() {
    // calculate new location
    this.props.onPlacesChanged(/*newLocation*/)
  }

  render() {  
    return (
      <SearchBox
        ref={this.addRefToState}
        bounds={this.props.bounds || null}
        onPlacesChanged={this.handlePlacesChanged}
        controlPosition={this.props.controlPosition || 0}
      >
        <SearchInput />
      </SearchBox>
    );
  }
}

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAnWosRCKLdYTOWPwSjf-NjJuSehxvE_YY&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={props.currentLocation}
    center={props.center}
    ref={props.onMapMounted}
  >
    <SearchContainer 
      onPlacesChanged={props.onSearch}
    />
    <Marker 
      position={props.initialMarkerPos}
    />
    {//props.markers.map((marker, index) =>
      // <Marker key={index} position={props.initialMarkerPos} />
    //)
    }
  </GoogleMap>
);

export default class Map extends Component {
  constructor(props) {
    super(props);
    // Bind variables
    const {lat, lng} = this.props.initialCenter;
    this.refs = {};
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    // Initialize state
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentWillMount() {
    // Make ajax request to server for data
    // load data into a heatmap
  }

  handleMapMount(mapRef) {
    this.refs.map = mapRef;
    // add data loading logic here
    console.log("Map reference added.");
  }

  handleMarkerClick() {
    console.log('Marker is clicked');
  }
  
  render() {
    return (
      <MyMapComponent 
        currentLocation={this.state.currentLocation}
        onMarkerClick={this.handleMarkerClick}
        initialMarkerPos={this.state.currentLocation}
        onMapMounted={this.handleMapMount}
      >
      </MyMapComponent>
    );
  }
}

Map.defaultProps = {
  zoom: 13,
  // San Francisco by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrentLocation: false
};

Map.propTypes = {
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool
};