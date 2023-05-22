import React from 'react';
import { CommonHelmet } from 'helper-components/common-helmet';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <>
        <CommonHelmet title="TODO" description="TODO" />
        TODO
      </>
    );
  }
}

export type Props = {
  isMobile: boolean;

  navigate: (to: string) => void;
  throwError: (errorStatus: number) => void;
};

export type State = {
  loading: boolean;
};
