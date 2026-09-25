import { Alert, Snackbar, Typography } from '@mui/material';
import React from 'react';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      type: 'success',
      show: false,
    };
  }

  componentDidMount() {
    if (this.props.loggedOutSuccessfully) {
      this.setState({
        show: true,
        message: 'ログアウトしました。',
        type: 'success',
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { loggedOutSuccessfully } = this.props;

    if (!prevProps.loggedOutSuccessfully && loggedOutSuccessfully) {
      this.setState({
        show: true,
        message: 'ログアウトしました。',
        type: 'success',
      });
    }
  }

  render() {
    return (
      <Snackbar open={this.state.show} autoHideDuration={6000} onClose={this.handleCloseMessage}>
        <Alert
          onClose={this.handleCloseMessage}
          severity={this.state.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <Typography fontSize="inherit">{this.state.message}</Typography>
        </Alert>
      </Snackbar>
    );
  }

  protected handleCloseMessage = () =>
    this.setState({
      show: false,
    });
}

export type Props = {
  loggedOutSuccessfully: boolean;
};

export type State = {
  message: string;
  type: 'success' | 'error';
  show: boolean;
};
