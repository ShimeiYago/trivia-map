import React, { ReactNode } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import {
  LatLng,
  LeafletEventHandlerFnMap,
  Marker as MarkerType,
} from 'leaflet';
import { defaultIcon, redIcon } from './icons';

export class MapMarker extends React.Component<Props> {
  static defaultProps = {
    variant: 'blue',
    dragable: false,
  };

  markerRef: React.RefObject<MarkerType>;

  constructor(props: Props) {
    super(props);
    this.markerRef = React.createRef();
  }

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
      <Marker
        position={this.props.position}
        icon={icon}
        draggable={this.props.dragable}
        ref={this.markerRef}
        eventHandlers={this.eventHandlers}
      >
        {tooltip}
        {popup}
      </Marker>
    );
  }

  protected eventHandlers: LeafletEventHandlerFnMap = {
    dragstart: () => {
      if (this.props.onDragStart) {
        this.props.onDragStart();
      }
    },
    dragend: () => {
      const marker = this.markerRef.current;
      if (marker != null && this.props.onDragEnd) {
        this.props.onDragEnd(marker.getLatLng());
      }
    },
  };
}

export type Props = {
  position: LatLng;
  variant: 'blue' | 'red';
  popup?: ReactNode;
  permanentTooltip?: ReactNode;
  dragable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (position: LatLng) => void;
};
