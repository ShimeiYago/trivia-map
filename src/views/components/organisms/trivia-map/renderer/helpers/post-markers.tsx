import React from 'react';
import { Box } from '@mui/material';
import { Marker } from 'store/markers/model';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import styles from './index.module.css';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';

export class PostMarkers extends React.Component<Props> {
  render() {
    const { map, markers, popupDisabled, hiddenMarkerIds } = this.props;

    const markerElmList = markers.map((marker) => {
      if (hiddenMarkerIds.includes(marker.markerId)) {
        return null;
      }

      const popup = !popupDisabled && this.renderPopupContents(marker.markerId);

      return (
        <MapMarker
          map={map}
          position={new LatLng(marker.lat, marker.lng)}
          popup={popup}
          key={`post-marker-${marker.markerId}`}
        />
      );
    });

    return <>{markerElmList}</>;
  }

  protected renderPopupContents = (markerId: number) => {
    return (
      <Box className={styles['popup-content']}>
        <ArticlePreviewList type="markerId" keyId={markerId} />
      </Box>
    );
  };
}

export type Props = {
  map: LeafletMap;
  markers: Marker[];
  popupDisabled: boolean;
  hiddenMarkerIds: number[];
};
