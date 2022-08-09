import React from 'react';
import { Box, Button } from '@mui/material';
import { Marker } from 'store/markers/model';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import styles from './index.module.css';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Position } from 'types/position';

export class PostMarkers extends React.Component<Props> {
  render() {
    const { map, markers, popupDisabled, hiddenMarkerIds } = this.props;

    const markerElmList = markers.map((marker) => {
      if (hiddenMarkerIds.includes(marker.markerId)) {
        return null;
      }

      const popup =
        !popupDisabled && this.renderPopupContents(marker.markerId, marker);

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

  protected renderPopupContents = (markerId: number, position: Position) => {
    return (
      <Box className={styles['popup-content']}>
        <ArticlePreviewList
          searchConditions={{ marker: markerId }}
          variant="popup"
        />
        {this.renderAddButton(position)}
      </Box>
    );
  };

  protected renderAddButton = (position: Position) => {
    if (this.props.hideAddButton) {
      return null;
    }
    return (
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button
          onClick={this.handleClickAdd(position)}
          startIcon={<AddLocationAltIcon />}
        >
          投稿を追加する
        </Button>
      </Box>
    );
  };

  protected handleClickAdd = (position: Position) => () => {
    this.props.openFormWithTheMarker(position);
  };
}

export type Props = {
  map: LeafletMap;
  markers: Marker[];
  popupDisabled: boolean;
  hiddenMarkerIds: number[];
  hideAddButton: boolean;

  openFormWithTheMarker: (position: Position) => void;
};
