import React from 'react';
import { INTERNAL_ERROR_LINK, NOT_FOUND_LINK } from 'constant/links';
import { Navigate } from 'react-router-dom';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.errorStatus && !prevProps.errorStatus) {
      this.setState({
        redirectTo: this.props.errorStatus,
      });
      this.props.resetErrorStatus();
    }
  }
  render() {
    switch (this.state.redirectTo) {
      case 404:
        return <Navigate to={NOT_FOUND_LINK} />;
      case 500:
        return <Navigate to={INTERNAL_ERROR_LINK} />;
      default:
        return this.props.children;
    }
  }
}

export type Props = {
  errorStatus?: number;
  children: React.ReactNode;

  resetErrorStatus: () => void;
};

export type State = {
  redirectTo?: number;
};
