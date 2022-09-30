import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';

export const Login = () => {
  usePageTracking();

  return <Renderer />;
};
