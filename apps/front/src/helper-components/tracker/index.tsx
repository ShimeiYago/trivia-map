import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { ANALYTICS_ID_ENV_KEY } from 'constant';

export function Tracker(props: { children: React.ReactNode }): JSX.Element {
  const analyticsId = process.env[ANALYTICS_ID_ENV_KEY];

  useEffect(() => {
    if (analyticsId) {
      !ReactGA.isInitialized && ReactGA.initialize(analyticsId);
      ReactGA.send('pageview');
    }
  }, []);

  return <>{props.children}</>;
}
