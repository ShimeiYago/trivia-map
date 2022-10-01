import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { ANALYTICS_ID_ENV_KEY } from 'constant';

const usePageTracking = () => {
  const location = useLocation();
  const analyticsId = process.env[ANALYTICS_ID_ENV_KEY];

  useEffect(() => {
    if (analyticsId) {
      ReactGA.initialize(analyticsId);
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default usePageTracking;
