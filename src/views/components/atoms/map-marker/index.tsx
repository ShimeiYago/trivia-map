import React, { ReactNode } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { defaultIcon, redIcon } from './icons';

export class MapMarker extends React.Component<Props> {
  static defaultProps = {
    type: 'default',
  };

  render() {
    let icon;
    switch (this.props.type) {
      case 'default':
        icon = defaultIcon;
        break;
      case 'red':
        icon = redIcon;
        break;
    }

    const popup = this.props.popup ? <Popup>{this.props.popup}</Popup> : null;

    return (
      <Marker position={this.props.position} icon={icon}>
        {popup}
      </Marker>
    );
  }
}

export type Props = {
  position: LatLng;
  type: 'default' | 'red';
  popup?: ReactNode;
};
