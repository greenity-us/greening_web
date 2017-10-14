// import createMapComponent from './googleapicomponent';
import React, { Component } from 'react';
// import { Map } from '../Components/customap';
import HeatMap from '../Components/heatMap';
// import SearchBox from "react-google-maps/lib/components/places/SearchBox";

export default class Container extends Component {
  render() {
    // if (!this.props.loaded) {
    //   return <div>Loading...</div>
    // }

    return (
      <div>
        {/* <Map google={this.props.google}>
        </Map> */}
        <HeatMap />
      </div>
    );
  }
}

// export default createMapComponent({
//   apiKey: 'AIzaSyAnWosRCKLdYTOWPwSjf-NjJuSehxvE_YY'
// })(Container);