import React from 'react';
import { INTERNAL_ERROR_LINK } from 'constant/links';
import { Navigate } from 'react-router-dom';
import { CommonErrorPage } from 'views/pages/common-error-page';

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
        return <CommonErrorPage errorStatus={404} />;
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
