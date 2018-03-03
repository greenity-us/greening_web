import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App, Heatmap } from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('map'));

ReactDOM.render(<Heatmap />, document.getElementById('map'));

registerServiceWorker();
