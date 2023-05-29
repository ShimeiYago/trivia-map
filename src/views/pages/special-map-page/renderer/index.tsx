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
import { ParkMap } from 'views/components/moleculars/park-map';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { Box } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { mapWrapper, parkSelectBox } from './styles';
import { ParkSelectBox } from 'views/components/moleculars/park-select-box';

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
      return (
        <Box my={1}>
          <CenterSpinner />
        </Box>
      );
    }

    return (
      <>
        <CommonHelmet title={specialMap.title} description={specialMap.description} />
        <GlobalMenu topBarPosition="static" mapPage>
          {this.renderSpecialMap(windowWidth, windowHeight)}
        </GlobalMenu>
      </>
    );
  }

  protected renderSpecialMap = (windowWidth: number, windowHeight: number) => {
    const { isMobile } = this.props;

    return (
      <Box sx={mapWrapper(isMobile, windowWidth, windowHeight)}>
        <ParkMap park={this.state.park} />

        <Box sx={parkSelectBox(isMobile)}>
          <ParkSelectBox park={this.state.park} onChangePark={this.handleChangePark} />
        </Box>

        <LoadingProgressBar
          loadedPages={this.state.loadedMarkerPages}
          totalPages={this.state.totalMarkerPages}
          fetchingState={this.state.loadingMarkers ? 'loading' : 'success'}
          isMobile={this.props.isMobile}
        />
      </Box>
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

  protected handleChangePark = (park: Park) => {
    this.setState({
      park,
    });
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
