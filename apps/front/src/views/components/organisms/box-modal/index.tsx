import { useWindowSize } from 'helper-components/user-window-size';
import { Renderer, Props } from './renderer';

export function BoxModal(ownProps: OwnProps) {
  const [, height] = useWindowSize();

  const props: Props = {
    ...ownProps,
    windowHeight: height,
  };

  return <Renderer {...props} />;
}

type OwnProps = Omit<Props, 'windowHeight'>;
