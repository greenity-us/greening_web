import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export class Map extends Component {
  constructor(props) {
    super(props);
    this.load = this.load.bind(this);

    const {lat, lng} = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        console.log('Navigator is enabled. Requesting location.');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords;
            this.setState({
              currentLocation: {
                lat: coords.latitude,
                lng: coords.longitude
              }
            });
          }
        );
      }
    }
    // load map after component mounts
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      // at first google property will be undefined
      // load map after it's defined (API call has finished)
      this.loadMap();
    }

    // if (prevState.currentLocation !== this.state.currentLocation) {
    //   this.recenterMap();
    // }
  }
  
  // recenterMap() {
  //   // recenter map here
  //   console.log('Location changed. Attempting Map recenter.');
  // }

  load() {
    if(this.props && this.props.google) {
      // store google map properties in local variables
      const {google} = this.props;
      const maps = google.maps;
      // get reference to actual DOM node of the map
      const mapNode = ReactDOM.findDOMNode(this.mapDiv);
      // configure map
      let {initialCenter, zoom} = this.props;
      const {lat, lng} = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      });
      // render map on DOM
      this.map = new maps.Map(mapNode, mapConfig);
    }
  }

  render() {
    const style = {
      width: '95vw',
      height: '90vh',
      margin: '0 auto'
    }

    return (
      <div 
        ref={(mapDiv) => {
          this.mapDiv = mapDiv;
        }}
        style={style}
      >
        Interactive map goes here. You may have JavaScript disabled if you cannot see it. Please check your browser and security settings.
      </div>
    );
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool
};

Map.defaultProps = {
  zoom: 13,
  // San Francisco by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrentLocation: false
};