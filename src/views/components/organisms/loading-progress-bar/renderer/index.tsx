import { LinearProgress } from '@mui/material';
import React from 'react';
import { sleep } from 'utils/sleep';
import { DialogScreen } from 'views/components/atoms/dialog-screen';

export class Renderer extends React.Component<Props, State> {
  closeTimeMs = 1000;

  constructor(props: Props) {
    super(props);
    this.state = {
      showLoadingProgressBar: props.markersLoading,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.markersLoading && this.props.markersLoading) {
      this.setState({
        showLoadingProgressBar: true,
      });
    }
    if (prevProps.markersLoading && !this.props.markersLoading) {
      this.closeLoadingProgressBar();
    }
  }

  render() {
    const { markersCurrentPageToLoad, markersTotalPages } = this.props;

    if (!this.state.showLoadingProgressBar) {
      return null;
    }

    const progressValue = markersTotalPages
      ? parseInt(
          ((markersCurrentPageToLoad / markersTotalPages) * 100).toFixed(),
        )
      : 0;

    return (
      <DialogScreen theme="white" position="bottom">
        <LinearProgress variant="buffer" value={progressValue} />
      </DialogScreen>
    );
  }

  protected async closeLoadingProgressBar() {
    await sleep(this.closeTimeMs);
    this.setState({
      showLoadingProgressBar: false,
    });
  }
}

export type Props = {
  markersCurrentPageToLoad: number;
  markersTotalPages?: number;
  markersLoading: boolean;
};

export type State = {
  showLoadingProgressBar: boolean;
};
