import React from 'react';
import { Typography, Stack } from '@mui/material';
import { Marker } from 'store/markers/model';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { Image } from 'views/components/atoms/image';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

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
    // TODO: Show list of article
    const postId = 'xxx';
    const title = 'タイトル';
    const imageUrl = 'xxxxx';

    return (
      <Link to={`/article/${postId}`} className={styles['popup-link']}>
        <>{markerId}</>
        <Stack spacing={1}>
          <Typography component="h2" variant="h6" align="center">
            {title}
          </Typography>

          {imageUrl && (
            <Typography align="center">
              <Image
                src={imageUrl}
                width="200px"
                height="100px"
                objectFit="cover"
                borderRadius
              />
            </Typography>
          )}

          <Typography align="center">
            <Typography variant="button" color="primary">
              くわしく読む
            </Typography>
          </Typography>
        </Stack>
      </Link>
    );
  };
}

export type Props = {
  map: LeafletMap;
  markers: Marker[];
  popupDisabled: boolean;
  hiddenMarkerIds: number[];
};
