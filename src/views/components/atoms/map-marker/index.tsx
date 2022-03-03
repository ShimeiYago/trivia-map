import React, { ReactNode } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { defaultIcon, redIcon } from './icons';

export class MapMarker extends React.Component<Props> {
  static defaultProps = {
    variant: 'default',
  };

  render() {
    let icon;
    switch (this.props.variant) {
      case 'blue':
        icon = defaultIcon;
        break;
      case 'red':
        icon = redIcon;
        break;
    }

    const popup = this.props.popup ? <Popup>{this.props.popup}</Popup> : null;

    const tooltip = this.props.permanentTooltip ? (
      <Tooltip permanent interactive direction="top">
        {this.props.permanentTooltip}
      </Tooltip>
    ) : null;

    return (
      <Marker position={this.props.position} icon={icon}>
        {tooltip}
        {popup}
      </Marker>
    );
  }
}

export type Props = {
  position: LatLng;
  variant: 'blue' | 'red';
  popup?: ReactNode;
  permanentTooltip?: ReactNode;
};
