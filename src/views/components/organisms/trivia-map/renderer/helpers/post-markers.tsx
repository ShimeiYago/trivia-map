import React from 'react';
import { Typography } from '@mui/material';
import { MarkerDict } from 'store/markers/model';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';

export class PostMarkers extends React.Component<Props> {
  render() {
    const { map, markers, popupDisabled, hiddenMarkerIds } = this.props;

    const markerElmList = Object.keys(markers).map((postId) => {
      if (hiddenMarkerIds.includes(postId)) {
        return null;
      }

      const marker = markers[postId];

      const popup = !popupDisabled && this.renderPopupContents(marker.title);

      return (
        <MapMarker
          map={map}
          position={new LatLng(marker.position.lat, marker.position.lng)}
          popup={popup}
          key={`post-marker-${postId}`}
        />
      );
    });

    return <>{markerElmList}</>;
  }

  protected renderPopupContents = (title: string) => (
    <Typography>{title}</Typography>
  );
}

export type Props = {
  map: LeafletMap;
  markers: MarkerDict;
  popupDisabled: boolean;
  hiddenMarkerIds: string[];
};
