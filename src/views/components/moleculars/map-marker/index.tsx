import React, { ReactNode } from 'react';
import { Marker } from 'react-leaflet';
import { LatLng, LeafletEventHandlerFnMap, Marker as MarkerType, Map as LeafletMap } from 'leaflet';

import { defaultIcon, redIcon, redIconWithNumber, restroomIcon } from './icons';
import { CustomMarker } from './helpers/custom-marker';
import { ZOOMS } from 'constant';
import { MapMarkerVariant } from 'types/marker-icon';

export class MapMarker extends React.Component<Props, State> {
  static defaultProps: Pick<Props, 'variant' | 'draggable' | 'autoOpen' | 'zIndexOffset'> = {
    variant: 'blue',
    draggable: false,
    autoOpen: false,
    zIndexOffset: 0,
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
      case 'restroom':
        icon = restroomIcon;
        break;
    }

    if (this.props.numberOfContents) {
      icon = redIconWithNumber(String(this.props.numberOfContents));
    }

    if (!this.props.mapController) {
      return (
        <Marker
          position={this.props.position}
          icon={icon}
          draggable={this.props.draggable}
          ref={this.markerRef}
          zIndexOffset={this.props.zIndexOffset}
        />
      );
    }

    if (!this.props.mapController.popup) {
      return (
        <Marker
          position={this.props.position}
          icon={icon}
          draggable={this.props.draggable}
          ref={this.markerRef}
          eventHandlers={this.eventHandlers(this.props.mapController.map)}
          zIndexOffset={this.props.zIndexOffset}
        />
      );
    }

    return (
      <>
        <CustomMarker
          map={this.props.mapController.map}
          position={this.props.position}
          icon={icon}
          draggable={this.props.draggable}
          ref={this.markerRef}
          eventHandlers={this.eventHandlers(this.props.mapController.map)}
          popup={this.state.isPopupOpened && this.props.mapController.popup}
          autoOpen={this.props.autoOpen}
          zIndexOffset={this.props.zIndexOffset}
        />
      </>
    );
  }

  protected eventHandlers(leafletMap: LeafletMap): LeafletEventHandlerFnMap {
    return {
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

        const latGap =
          leafletMap.getZoom() <= ZOOMS.popupOpen
            ? 30
            : 30 / (leafletMap.getZoom() - ZOOMS.popupOpen + 1);
        const lat = this.props.position.lat + latGap;

        const position = new LatLng(lat, this.props.position.lng);
        const zoom = leafletMap.getZoom() >= ZOOMS.popupOpen ? undefined : ZOOMS.popupOpen;
        leafletMap.flyTo(position, zoom);
      },

      popupclose: async () => {
        this.setState({
          isPopupOpened: false,
        });
      },
    };
  }

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
  zIndexOffset: number;
  variant: MapMarkerVariant;
  autoOpen: boolean;
  draggable?: boolean;
  numberOfContents?: number;
  isMobile?: boolean;
  mapController?: MapController;
  onDragStart?: () => void;
  onDragEnd?: (position: LatLng) => void;
};

export type State = {
  isPopupOpened: boolean;
  dragging: boolean;
};

type MapController = {
  popup?: ReactNode;
  map: LeafletMap;
};
