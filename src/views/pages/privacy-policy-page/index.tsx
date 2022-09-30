import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';

export const PrivacyPolicyPage = () => {
  usePageTracking();
  return <Renderer />;
};
