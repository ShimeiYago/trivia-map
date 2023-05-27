import React from 'react';
import { Park } from 'types/park';
import { CommonHelmet } from 'helper-components/common-helmet';
import { GetSpecialMapResponse, getSpecialMap } from 'api/special-map-api/get-special-map';
import {
  GetSpecialMapMarkersResponse,
  GetSpecialMapMarkersResponseWithPagination,
  getSpecialMapMarkers,
} from 'api/special-map-api/get-special-map-markers';
import { LoadingProgressBar } from 'views/components/moleculars/loading-progress-bar';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingSpecialMap: true,
      loadingMarkers: true,
      park: 'L',
      markers: [],
      loadedMarkerPages: 0,
    };
  }

  componentDidMount(): void {
    this.fetchSpecialMap();
    this.fetchSpecialMapMarkers();
  }

  render() {
    const { windowWidth, windowHeight } = this.props;
    const { specialMap } = this.state;

    if (!windowWidth || !windowHeight || !specialMap) {
      return null;
    }

    return (
      <>
        <CommonHelmet title={specialMap.title} description={specialMap.description} />

        {this.renderSpecialMap(windowWidth, windowHeight)}
      </>
    );
  }

  protected renderSpecialMap = (windowWidth: number, windowHeight: number) => {
    return (
      <>
        <div>{`TODO (${windowWidth}, ${windowHeight})`}</div>
        <LoadingProgressBar
          loadedPages={this.state.loadedMarkerPages}
          totalPages={this.state.totalMarkerPages}
          fetchingState={this.state.loadingMarkers ? 'loading' : 'success'}
          isMobile={this.props.isMobile}
        />
      </>
    );
  };

  protected fetchSpecialMap = async () => {
    try {
      const res = await getSpecialMap(this.props.mapId);
      this.setState({
        loadingSpecialMap: false,
        specialMap: res,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };

  protected fetchSpecialMapMarkers = async () => {
    try {
      let totalPages = 1;
      let loadedPages = 0;
      while (loadedPages < totalPages) {
        let res: GetSpecialMapMarkersResponseWithPagination;
        if (loadedPages === 0) {
          res = await getSpecialMapMarkers({ mapId: this.props.mapId });
          totalPages = res.totalPages;
          this.setState({
            totalMarkerPages: totalPages,
          });
        } else {
          res = await getSpecialMapMarkers({ mapId: this.props.mapId, page: loadedPages + 1 });
        }

        loadedPages += 1;

        this.setState({
          markers: [...this.state.markers, ...res.results],
          loadedMarkerPages: loadedPages,
        });
      }
      this.setState({
        loadingMarkers: false,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  mapId: number;
  isMobile: boolean;
  windowWidth: number;
  windowHeight: number;

  navigate: (to: string) => void;
  throwError: (errorStatus: number) => void;
};

export type State = {
  specialMap?: GetSpecialMapResponse;
  loadingSpecialMap: boolean;
  markers: GetSpecialMapMarkersResponse[];
  loadingMarkers: boolean;
  park: Park;
  loadedMarkerPages: number;
  totalMarkerPages?: number;
};
