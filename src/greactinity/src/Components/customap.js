import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import _ from 'lodash';

// helper variables
const eventNames = ['ready', 'click', 'dragend'];
const camelize = function(str) {
  return str.split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

export class Map extends Component {
  constructor(props) {
    super(props);
    this.load = this.load.bind(this);

    const {lat, lng} = this.props.initialCenter;
    // Initialize state
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
  }

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
      // add event listeners for each event
      eventNames.forEach( name => {
        // name is a string with the event name
        this.map.addListener(name, this.handleEvent(name))
      });
      // example listener for single event
      // this.map.addListener('dragend', (event) => {
      //   this.props.onMove(this.map);
      // });
      maps.event.trigger(this.map, 'ready');
    }
  }

  handleEvent(evtName) {
    let timeout;
    // use setTimeout(function, 0) pattern to avoid
    // too many events being fired at once and lagging
    // the browser, gives smoother map rendering
    const handlerName = `on${camelize(evtName)}`;
    return (evt) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        // optionally include conditional event handling logic here
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, evt);
        }
      } , 0)
    } 
  }

  renderChildren() {
    const {children} = this.props;
    // allow the map to render without children
    if (!children) return;
    // can optionally clone or copy children here
    return React.Children.map(children, childElement => {
      return React.cloneElement(childElement, {
        map:        this.map,
        google:     this.props.google,
        mapCenter:  this.state.currentLocation
      });
    });
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
        Loading map...
        {this.renderChildren()}
      </div>
    );
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool,
  onMove: PropTypes.func
};
// programmatically add proptypes for on_____ events
// stored in const eventNames and camelized for moar
// JavaScriptyness
eventNames.forEach( evt => 
  {
    Map.propTypes[camelize(evt)] = PropTypes.func;
  }
);

Map.defaultProps = {
  zoom: 13,
  // San Francisco by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrentLocation: false,
  onMove: function() {}
};