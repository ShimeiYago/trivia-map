import ReactGA from 'react-ga4';
import { ANALYTICS_ID_ENV_KEY } from 'constant';

export function sendGa4ExceptionEvent(param: Param) {
  const analyticsId = process.env[ANALYTICS_ID_ENV_KEY];

  if (analyticsId) {
    const apiErrorLabel = `[${param.apiStatusCode}]${param.apiEndpoint}`;

    !ReactGA.isInitialized && ReactGA.initialize(analyticsId);
    ReactGA.send({
      hitType: 'event',
      eventAction: 'exception',
      eventValue: param.message,
      eventCategory: param.errorCategory,
      eventLabel: param.errorLabel ?? apiErrorLabel,
    });
  }
}

type Param = {
  errorCategory: 'front-error' | 'api-error';
  apiStatusCode?: number;
  apiEndpoint?: string;
  errorLabel?: string;
  message: string;
};
