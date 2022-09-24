import { Renderer } from './renderer';
import usePageTracking from 'tracker';

export const Login = () => {
  usePageTracking();

  return <Renderer />;
};
