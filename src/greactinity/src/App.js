import React, { Component } from 'react';
import './App.css';
import { MapWithASearchBox } from './map';
import Gmap from './helpers/mapcontainer';

export class App extends Component {
  render() {
    return (
      <MapWithASearchBox />
    );
  }
}

export class Heatmap extends Component {
  render() {
    return (
      <Gmap />
    );
  }
}