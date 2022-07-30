import { Props, Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';

export function Admin() {
  const props: Props = {
    user: useAppSelector(selectUser),
  };

  return <Renderer {...props} />;
}
