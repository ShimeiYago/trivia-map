import React from 'react';
import { sendGa4ExceptionEvent } from 'utils/send-ga4-exception-event';
import { InternalError } from 'views/components/moleculars/internal-error';

export class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
    error: new Error(),
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // You can also log the error to an error reporting service like "Sentry.io"
    // logErrorToMyService(error, errorInfo);
    console.log(`error: ${error.message}`);
    console.log(`componentStack: ${errorInfo.componentStack}`);

    sendGa4ExceptionEvent({
      errorCategory: 'front-error',
      errorLabel: error.message,
      message: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }

  protected renderErrorFallback() {
    return <InternalError />;
  }
}

export type Props = {
  children: React.ReactNode;
};

export type State = {
  hasError: boolean;
  error: Error;
};
