import React, { ReactNode } from 'react';
import { Marker } from 'react-leaflet';
import { LatLng, LeafletEventHandlerFnMap, Marker as MarkerType, Map as LeafletMap } from 'leaflet';

import { defaultIcon, numberCircleIcon, redIcon } from './icons';
import { CustomMarker } from './helpers/custom-marker';
import { ZOOMS } from 'constant';

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
      dragging: false,
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

    const numberCircleMarker = !this.state.dragging && this.props.numberOfContents && (
      <Marker
        position={this.props.position}
        icon={numberCircleIcon(String(this.props.numberOfContents))}
        eventHandlers={this.numberCircleEventHandlers}
      />
    );

    if (!this.props.popup) {
      return (
        <div>
          <Marker
            position={this.props.position}
            icon={icon}
            draggable={this.props.draggable}
            ref={this.markerRef}
            eventHandlers={this.eventHandlers}
          />
          <div>{numberCircleMarker}</div>
        </div>
      );
    }

    return (
      <>
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
        {numberCircleMarker}
      </>
    );
  }

  protected eventHandlers: LeafletEventHandlerFnMap = {
    dragstart: () => {
      if (this.props.onDragStart) {
        this.props.onDragStart();
      }
      this.setState({
        dragging: true,
      });
    },

    dragend: () => {
      const marker = this.markerRef.current;
      if (marker != null && this.props.onDragEnd) {
        this.props.onDragEnd(marker.getLatLng());
      }
      this.setState({
        dragging: false,
      });
    },

    popupopen: () => {
      this.setState({
        isPopupOpened: true,
      });

      const latGap = this.props.isMobile
        ? this.props.map.getZoom() <= ZOOMS.popupOpen
          ? 30
          : 30 / (this.props.map.getZoom() - ZOOMS.popupOpen + 1)
        : 10;
      const lat = this.props.position.lat + latGap;

      const position = new LatLng(lat, this.props.position.lng);
      const zoom = this.props.map.getZoom() >= ZOOMS.popupOpen ? undefined : ZOOMS.popupOpen;
      this.props.map.flyTo(position, zoom);
    },

    popupclose: async () => {
      this.setState({
        isPopupOpened: false,
      });
    },
  };

  protected numberCircleEventHandlers: LeafletEventHandlerFnMap = {
    click: () => {
      const marker = this.markerRef.current;
      if (marker != null) {
        !this.state.isPopupOpened && marker.openPopup();
      }
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
  numberOfContents?: number;
  isMobile?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (position: LatLng) => void;
};

export type State = {
  isPopupOpened: boolean;
  dragging: boolean;
};
