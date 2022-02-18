import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapMarker } from 'views/components/atoms/map-marker';
import { LatLng, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { Marker } from 'store/markers/model';
import { Button } from '@mui/material';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { Article } from 'views/components/organisms/article';
export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
    this.state = {
      openArticleModal: false,
    };
  }

  componentDidMount() {
    this.props.fetchMarkers();
  }

  render() {
    return (
      <>
        <MapContainer
          center={new LatLng(0, 0)}
          zoom={1}
          minZoom={1}
          maxZoom={4}
          maxBounds={[
            [300, -300],
            [-300, 300],
          ]}
          whenCreated={this.handleMapCreated}
        >
          <TileLayer
            attribution="<a href='https://www.tokyodisneyresort.jp/tds/map.html' target='_blank'>【公式】マップ | 東京ディズニーシー</a>"
            url="/tds-map-tiles/{z}/{x}/{y}.png"
            noWrap
          />
          {this.renderPostMarkers()}
          {this.renderCurrentPositionMarker()}
        </MapContainer>

        <BoxModal
          open={this.state.openArticleModal}
          onClose={this.handleCloseArticleModal}
        >
          <Article />
        </BoxModal>
      </>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    map.on('click', this.handleMapClick);
  }

  protected handleMapClick = (e: LeafletMouseEvent) => {
    this.setState({
      currentPosition: e.latlng,
    });
  };

  protected renderCurrentPositionMarker() {
    const { currentPosition } = this.state;

    if (currentPosition === undefined) {
      return null;
    }

    const popup = (
      <>
        lat: {currentPosition.lat}
        <br />
        lng: {currentPosition.lng}
      </>
    );

    return <MapMarker position={currentPosition} popup={popup} type="red" />;
  }

  protected renderPostMarkers() {
    return this.props.markerList.map((marker) => {
      const popup = (
        <Button
          variant="text"
          onClick={this.handleClickPostTitle(marker.postId)}
        >
          {marker.title}
        </Button>
      );

      new LatLng(marker.position.lat, marker.position.lng);

      return (
        <MapMarker
          position={new LatLng(marker.position.lat, marker.position.lng)}
          popup={popup}
          key={marker.postId}
        />
      );
    });
  }

  protected handleClickPostTitle = (postId: string) => {
    return () => {
      this.setState({
        openArticleModal: true,
      });
      this.props.fetchArticle(postId);
    };
  };

  protected handleCloseArticleModal = () => {
    this.setState({
      openArticleModal: false,
    });
  };
}

export type Props = {
  markerList: Marker[];
  loadingMarkers: boolean;

  fetchMarkers: () => void;
  fetchArticle: (postId: string) => void;
};

export type State = {
  currentPosition?: LatLng;
  openArticleModal: boolean;
};
