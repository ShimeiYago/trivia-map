import { Renderer } from './renderer';
import usePageTracking from 'tracker';

export const PrivacyPolicyPage = () => {
  usePageTracking();
  return <Renderer />;
};
