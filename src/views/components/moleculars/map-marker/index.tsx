import React, { ReactNode } from 'react';
import { Marker } from 'react-leaflet';
import {
  LatLng,
  LeafletEventHandlerFnMap,
  Marker as MarkerType,
  Map as LeafletMap,
} from 'leaflet';

import { defaultIcon, redIcon } from './icons';
import { CustomMarker } from './helpers/custom-marker';

export class MapMarker extends React.Component<Props, State> {
  static defaultProps: Pick<Props, 'variant' | 'draggable' | 'autoOpen'> = {
    variant: 'blue',
    draggable: false,
    autoOpen: false,
  };

  markerRef: React.RefObject<MarkerType>;

  constructor(props: Props) {
    super(props);
    this.markerRef = React.createRef();

    this.state = {
      isPopupOpened: false,
    };
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

    if (!this.props.popup) {
      return (
        <Marker
          position={this.props.position}
          icon={icon}
          draggable={this.props.draggable}
          ref={this.markerRef}
          eventHandlers={this.eventHandlers}
        />
      );
    }

    return (
      <CustomMarker
        map={this.props.map}
        position={this.props.position}
        icon={icon}
        draggable={this.props.draggable}
        ref={this.markerRef}
        eventHandlers={this.eventHandlers}
        popup={this.state.isPopupOpened && this.props.popup}
        autoOpen={this.props.autoOpen}
      />
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
    popupopen: () => {
      this.setState({
        isPopupOpened: true,
      });
    },
    popupclose: () => {
      this.setState({
        isPopupOpened: false,
      });
    },
  };
}

export type Props = {
  position: LatLng;
  variant: 'blue' | 'red';
  popup?: ReactNode;
  autoOpen: boolean;
  map: LeafletMap;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (position: LatLng) => void;
};

export type State = {
  isPopupOpened: boolean;
};
