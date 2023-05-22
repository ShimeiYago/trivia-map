import React from 'react';
import { Park } from 'types/park';
import { CommonHelmet } from 'helper-components/common-helmet';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      park: 'L',
    };
  }

  render() {
    return (
      <>
        <CommonHelmet title="TODO" description="TODO" />

        {this.renderSpecialMap()}
      </>
    );
  }

  protected renderSpecialMap = () => {
    const { windowWidth, windowHeight } = this.props;

    if (!windowWidth || !windowHeight) {
      return null;
    }

    return 'TODO';
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
  park: Park;
};
