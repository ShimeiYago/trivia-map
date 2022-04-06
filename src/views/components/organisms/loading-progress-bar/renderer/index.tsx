import { LinearProgress } from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { sleep } from 'utils/sleep';
import { DialogScreen } from 'views/components/atoms/dialog-screen';

// TODO: error case
// TODO: show texts

export class Renderer extends React.Component<Props, State> {
  closeTimeMs = 1000;

  constructor(props: Props) {
    super(props);
    this.state = {
      showLoadingProgressBar: props.markersFetchingState === 'loading',
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { markersFetchingState } = this.props;
    if (
      prevProps.markersFetchingState !== markersFetchingState &&
      markersFetchingState === 'loading'
    ) {
      this.setState({
        showLoadingProgressBar: true,
      });
    }
    if (
      prevProps.markersFetchingState === 'loading' &&
      prevProps.markersFetchingState !== markersFetchingState
    ) {
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
  markersFetchingState: LoadingState;
};

export type State = {
  showLoadingProgressBar: boolean;
};
