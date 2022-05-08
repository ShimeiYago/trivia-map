import React from 'react';
import { Typography, Stack } from '@mui/material';
import { MarkerDict } from 'store/markers/model';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { Image } from 'views/components/atoms/image';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

export class PostMarkers extends React.Component<Props> {
  render() {
    const { map, markers, popupDisabled, hiddenMarkerIds } = this.props;

    const markerElmList = Object.keys(markers).map((postId) => {
      if (hiddenMarkerIds.includes(postId)) {
        return null;
      }

      const marker = markers[postId];

      const popup =
        !popupDisabled &&
        this.renderPopupContents(postId, marker.title, marker.thumbnailImgUrl);

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

  protected renderPopupContents = (
    postId: string,
    title: string,
    imageUrl?: string,
  ) => (
    <Link to={`article/${postId}`} className={styles['popup-link']}>
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
}

export type Props = {
  map: LeafletMap;
  markers: MarkerDict;
  popupDisabled: boolean;
  hiddenMarkerIds: string[];
};
