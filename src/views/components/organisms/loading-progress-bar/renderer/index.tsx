import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { sleep } from 'utils/sleep';
import { DialogScreen } from 'views/components/atoms/dialog-screen';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
    const { markersLoadedRecords, markersTotalRecords, isMobile } = this.props;

    if (!this.state.showLoadingProgressBar) {
      return null;
    }

    const progressValue = markersTotalRecords
      ? parseInt(((markersLoadedRecords / markersTotalRecords) * 100).toFixed())
      : 0;

    return (
      <DialogScreen theme="white" position={isMobile ? 75 : 'bottom'}>
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
    const { markersFetchingState } = this.props;

    const icon =
      markersFetchingState === 'error' ? (
        <ErrorOutlineIcon color="error" />
      ) : (
        <CircularProgress size={20} />
      );

    const message =
      markersFetchingState === 'error' ? (
        <Typography variant="body1" color="error">
          {this.props.markersErrorMsg}
        </Typography>
      ) : (
        <Typography variant="body1" color="text.primary">
          データを読み込んでいます...
        </Typography>
      );

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Box sx={{ width: '30px' }}>{icon}</Box>
        <Box>{message}</Box>
      </Box>
    );
  };
}

export type Props = {
  markersLoadedRecords: number;
  markersTotalRecords?: number;
  markersFetchingState: LoadingState;
  markersErrorMsg?: string;
  isMobile: boolean;
};

export type State = {
  showLoadingProgressBar: boolean;
};
