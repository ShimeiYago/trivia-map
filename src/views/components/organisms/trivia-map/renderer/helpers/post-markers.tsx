import React from 'react';
import { Box, Button } from '@mui/material';
import { LatLng, Map as LeafletMap, MarkerCluster, DivIcon, Point } from 'leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Position } from 'types/position';
import { Marker } from 'types/marker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { ZOOMS } from 'constant';
import './index.css';

export class PostMarkers extends React.Component<Props> {
  render() {
    const { map, markers, popupDisabled, hiddenMarkerIds, isMobile, categoryId } = this.props;

    const markerElmList = markers.map((marker) => {
      if (hiddenMarkerIds.includes(marker.markerId)) {
        return null;
      }

      const popup = !popupDisabled && this.renderPopupContents(marker.markerId, marker);

      const numberOfPublicArticles =
        categoryId === undefined
          ? marker.numberOfPublicArticles.total
          : marker.numberOfPublicArticles.eachCategory[categoryId];

      if (numberOfPublicArticles === 0) {
        return null;
      }

      const numberOfContents = numberOfPublicArticles > 1 ? numberOfPublicArticles : undefined;

      return (
        <MapMarker
          map={map}
          position={new LatLng(marker.lat, marker.lng)}
          popup={popup}
          variant="red"
          numberOfContents={numberOfContents}
          key={`post-marker-${marker.markerId}`}
          isMobile={isMobile}
        />
      );
    });

    return (
      <MarkerClusterGroup
        showCoverageOnHover={false}
        removeOutsideVisibleBounds
        disableClusteringAtZoom={ZOOMS.max}
        iconCreateFunction={this.clusterIconCreator}
        chunkedLoading
        spiderfyOnMaxZoom={false}
      >
        {markerElmList}
      </MarkerClusterGroup>
    );
  }

  protected clusterIconCreator = (cluster: MarkerCluster) => {
    const childCount = cluster.getChildCount();

    return new DivIcon({
      html: '<div><span>' + childCount + '</span></div>',
      className: 'marker-cluster marker-cluster-red',
      iconSize: new Point(40, 40),
    });
  };

  protected renderPopupContents = (markerId: number, position: Position) => {
    return (
      <Box width={250}>
        <ArticlePreviewList
          searchConditions={{ marker: markerId, category: this.props.categoryId }}
          variant="popup"
        />
        {this.renderAddButton(position)}
      </Box>
    );
  };

  protected renderAddButton = (position: Position) => {
    return (
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button onClick={this.handleClickAdd(position)} startIcon={<AddLocationAltIcon />}>
          {this.props.editting ? 'ここにマーカーを置く' : 'ここにトリビアを追加する'}
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
  editting: boolean;
  isMobile: boolean;
  categoryId?: number;

  openFormWithTheMarker: (position: Position) => void;
};
