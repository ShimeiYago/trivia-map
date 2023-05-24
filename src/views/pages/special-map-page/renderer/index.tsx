import React from 'react';
import { Park } from 'types/park';
import { CommonHelmet } from 'helper-components/common-helmet';
import { GetSpecialMapResponse, getSpecialMap } from 'api/special-map-api/get-special-map';
import { GetSpecialMapMarkersResponse } from 'api/special-map-api/get-special-map-markers';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingSpecialMap: true,
      loadingSpecialMapMarkers: true,
      park: 'L',
    };
  }

  componentDidMount(): void {
    this.fetchSpecialMap();
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
    return `TODO (${windowWidth}, ${windowHeight})`;
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
  specialMapMarkers?: GetSpecialMapMarkersResponse;
  loadingSpecialMapMarkers: boolean;
  park: Park;
};
