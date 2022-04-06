import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { sleep } from 'utils/sleep';
import { DialogScreen } from 'views/components/atoms/dialog-screen';

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
      markersFetchingState === 'success'
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
        {this.renderDescriptionMessage()}
        {this.renderLinearProgressWithLabel(progressValue)}
      </DialogScreen>
    );
  }

  protected async closeLoadingProgressBar() {
    await sleep(this.closeTimeMs);
    this.setState({
      showLoadingProgressBar: false,
    });
  }

  protected renderLinearProgressWithLabel = (progressValue: number) => {
    const { markersFetchingState } = this.props;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            color={markersFetchingState === 'error' ? 'error' : 'primary'}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${progressValue}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  protected renderDescriptionMessage = () => {
    if (this.props.markersFetchingState === 'error') {
      return (
        <Typography variant="body1" color="red">
          {this.props.markersErrorMsg}
        </Typography>
      );
    }

    return (
      <Typography variant="body1" color="text.primary">
        データを読み込んでいます...
      </Typography>
    );
  };
}

export type Props = {
  markersCurrentPageToLoad: number;
  markersTotalPages?: number;
  markersFetchingState: LoadingState;
  markersErrorMsg?: string;
};

export type State = {
  showLoadingProgressBar: boolean;
};
