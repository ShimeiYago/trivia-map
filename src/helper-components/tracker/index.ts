import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { ANALYTICS_ID } from 'constant';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (ANALYTICS_ID) {
      ReactGA.initialize(ANALYTICS_ID);
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default usePageTracking;
